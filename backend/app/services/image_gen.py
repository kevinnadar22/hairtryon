"""
Image generation service using Replicate API.

This module handles the complete image generation workflow including
record creation, Replicate API integration, and S3 storage management.
"""

import time
from typing import List, Literal, Optional, cast

from core.config import settings
from core.exceptions import StyleNotFoundException
from db import Session
from enums import ImageStatus
from loguru import logger
from models import GeneratedImage
from pydantic import HttpUrl
from replicate.client import Client
from repository import GeneratedImageRepository, StyleRepository, UserRepository
from schemas import SideViewsResponse, UserImages, UserImagesResponse
from utils import get_file_info, get_view_prompt, save_image_from_url

from .image_upload import ImageUploadService


class ImageGenService:
    """Service to handle image generation logic."""

    def __init__(self, db: Session):
        self.db = db
        self.style_repository = StyleRepository(db)
        self.image_repository = GeneratedImageRepository(db)
        self.user_repository = UserRepository(db)

    def create_image_generation_record(
        self,
        user_id: int,
        style_id: int,
        input_image_url: str,
    ) -> GeneratedImage:
        """
        Create database record for image generation request.

        Args:
            user_id (int): ID of requesting user.
            style_id (int): ID of hairstyle to apply.
            input_image_url (str): URL of input image.

        Returns:
            GeneratedImage: Created database record.
        """
        style = self.style_repository.get_style_by_id(style_id)
        image_instance = self.image_repository.create_image_object(
            user_id=user_id,
            style_id=style_id,
            output_image_url=None,
            input_image_url=input_image_url,
            description=style.description if style else "",
        )
        return image_instance

    async def start_image_generation(
        self,
        image: GeneratedImage,
        view: Optional[Literal["right", "left", "back"]] = None,
    ) -> int:
        """
        Execute image generation workflow using Replicate API.

        Args:
            image (GeneratedImage): Image generation record with metadata.

        Returns:
            int: Image record ID.

        Raises:
            StyleNotFoundException: If style ID is invalid.
        """
        style_id = image.style_id
        image_input_url = image.input_image_url

        start_time = time.perf_counter()
        output_url = None
        status = ImageStatus.FAILED  # default fallback

        try:
            style = self.style_repository.get_style_by_id(style_id)
            if not style:
                raise StyleNotFoundException()

            if view and image.output_image_url:
                prompt = get_view_prompt(view)
                input_image = image.output_image_url
            elif not view:
                prompt = style.prompt
                input_image = image_input_url
            else:
                raise ValueError("Invalid view")

            self.image_repository.update_image_status(
                image_id=image.id,
                status=ImageStatus.PROCESSING,
            )

            prediction = await self.generate_image_from_replicate(prompt, input_image)
            # # test prediction structure
            # prediction = [
            #     SimpleNamespace(
            #         url="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
            #     )
            # ]

            if prediction and len(prediction) > 0:
                status = ImageStatus.COMPLETED

                # upload to S3
                output_url = await self._save_output_to_s3(prediction[0].url)  # type: ignore
                self.user_repository.dec_user_credits(
                    user=image.user,
                    credits=1,
                )

        except StyleNotFoundException:
            status = ImageStatus.FAILED
            logger.exception("Style not found for image %s", image.id)
            raise

        except Exception as e:
            status = ImageStatus.FAILED
            logger.exception(
                "Unhandled error during image generation for %s: %s", image.id, e
            )
            raise

        finally:
            duration = time.perf_counter() - start_time
            self._update_image_url(
                image=image,
                output_url=output_url,
                status=status,
                time_taken=duration,
                view=view,
            )
            logger.info(f"{image.id}={view} Image generated successfully")

        return image.id

    def _update_image_url(
        self,
        image: GeneratedImage,
        output_url: Optional[str],
        status: ImageStatus,
        time_taken: float,
        view: Optional[Literal["right", "left", "back"]] = None,
    ):
        image.status = status
        image.time_taken = time_taken
        if not view:
            image.output_image_url = output_url
        elif view == "right":
            image.right_view_url = output_url
        elif view == "left":
            image.left_view_url = output_url
        elif view == "back":
            image.back_view_url = output_url
        self.image_repository.raw_update_image(image)

    async def _save_output_to_s3(self, output_url: str) -> str:
        """
        Transfer generated image from Replicate to S3 bucket.

        Args:
            output_url (str): Temporary URL of generated image.

        Returns:
            str: Permanent S3 URL of uploaded image.
        """
        # Save to local temp storage
        local_path = await save_image_from_url(output_url)
        file_info = get_file_info(local_path)

        name = file_info["name"]
        mimetype = file_info["mime"]
        file_data = file_info["data"]

        s3_url = ImageUploadService.upload_image_to_s3(
            file_path=name,
            file_data=file_data,
            file_type=mimetype,
            folder=settings.GENERATED_IMAGES_FOLDER,
        )
        return s3_url

    @staticmethod
    async def generate_image_from_replicate(prompt: str, image_input: str) -> str:
        """
        Call Replicate API to generate styled image.

        Args:
            prompt (str): Style prompt for generation.
            image_input (str): URL of input image.

        Returns:
            str: Prediction response with output URLs.
        """
        replicate_client = Client(api_token=settings.REPLICATE_API_TOKEN)
        prediction = await replicate_client.async_run(
            "bytedance/seedream-4",
            input={
                "size": "1K",
                "width": 2048,
                "height": 2048,
                "prompt": prompt,
                "max_images": 1,
                "image_input": [image_input],
                "aspect_ratio": "match_input_image",
                "enhance_prompt": False,
                "sequential_image_generation": "disabled",
            },
        )
        return prediction  # type: ignore

    def get_available_styles(self):
        """
        Retrieve all hairstyles from database.

        Returns:
            List[Style]: List of available style records.
        """
        styles = self.style_repository.get_all_styles()
        return styles

    def get_image_record(self, image_id: int, user_id: int) -> GeneratedImage:
        """
        Retrieve image generation record by ID and user.

        Args:
            image_id (int): ID of image generation record.
            user_id (int): ID of user who owns the record.

        Returns:
            GeneratedImage: Image generation record with status.
        """
        image_record = self.image_repository.get_image_by_user_and_id(
            user_id=user_id,
            image_id=image_id,
        )
        return image_record

    def get_images_by_user_id(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        sort_desc: bool = True,
        favourites: bool = False,
    ) -> UserImagesResponse:
        """
        Retrieve images by user ID with pagination.

        Args:
            user_id (int): ID of the user who owns the images.
            page (int): Page number for pagination. Defaults to 1.
            limit (int): Number of images per page. Defaults to 10.
            sort_desc (bool): Whether to sort images in descending order. Defaults to True.
            favourites (bool): If True, fetch only favourite images. Defaults to False.

        Returns:
            List[GeneratedImage]: List of images.
        """
        images = self.image_repository.get_images_by_user_id(
            user_id=user_id,
            page=page,
            limit=limit,
            sort_desc=sort_desc,
            favourites=favourites,
        )
        formatted_images = []
        for row in images:
            side_views = self.to_side_views(row)
            user_image = UserImages(
                id=row.id,
                input_image_url=row.input_image_url,
                output_image_url=row.output_image_url,
                description=row.description,
                style_name=row.style.name,
                side_views=side_views,
                status=row.status,
                created_at=row.created_at,
                time_taken=row.time_taken,
            )
            formatted_images.append(user_image)

        total_count = self.image_repository.count_images_by_user_id(user_id=user_id)
        next_page = page + 1 if (page * limit) < total_count else None

        response = UserImagesResponse(
            images=formatted_images,
            page=page,
            limit=limit,
            total_images=total_count,
            next_page=next_page,
        )
        return response

    def get_user_input_images(self, user_id: int) -> List[HttpUrl]:
        """
        Retrieve input images uploaded by the user.

        Args:
            user_id (int): ID of the user.

        Returns:
            List[HttpUrl]: List of input image URLs.
        """
        images = self.image_repository.get_user_input_images(user_id=user_id, limit=5)
        input_image_urls = [cast(HttpUrl, row.input_image_url) for row in images]
        return input_image_urls

    def like_image(self, image_id: int, user_id: int) -> bool:
        """
        Like an image on behalf of a user.

        Args:
            image_id (int): ID of the image to like.
            user_id (int): ID of the user liking the image.
        """
        self.image_repository.like_image(user_id=user_id, image_id=image_id, liked=True)
        return True

    def dislike_image(self, image_id: int, user_id: int) -> bool:
        """
        Dislike an image on behalf of a user.

        Args:
            image_id (int): ID of the image to dislike.
            user_id (int): ID of the user disliking the image.
        """
        self.image_repository.like_image(
            user_id=user_id, image_id=image_id, liked=False
        )
        return True

    def to_side_views(self, row: GeneratedImage) -> SideViewsResponse | None:
        rv = row.right_view_url
        lv = row.left_view_url
        bv = row.back_view_url

        if rv is None or lv is None or bv is None:
            return None

        return SideViewsResponse(
            right_view_url=cast(HttpUrl, rv),
            left_view_url=cast(HttpUrl, lv),
            back_view_url=cast(HttpUrl, bv),
        )
