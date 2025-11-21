"""
Generated image repository for database operations.

This module provides data access layer for GeneratedImage model operations
including creation, updates, and retrieval of image generation records.
"""

from typing import List, Optional

from db import Session
from enums import ImageStatus
from models import GeneratedImage
from sqlalchemy import func
from sqlalchemy.orm import joinedload


class GeneratedImageRepository:
    """Repository for managing GeneratedImage entities in the database."""

    def __init__(self, db: Session):
        self.db = db

    def create_image_object(
        self,
        user_id: int,
        style_id: int,
        output_image_url: str | None,
        input_image_url: str,
        description: str = "",
    ) -> GeneratedImage:
        """
        Create a new image object in the database.

        Args:
            user_id (int): ID of the user who owns the image.
            style_id (int): ID of the style applied to the image.
            prediction_id (str | None): ID of the prediction job.
            output_image_url (str | None): URL of the generated image.
            input_image_url (str): URL of the input image.

        Returns:
            GeneratedImage: The created image object.
        """
        new_image = GeneratedImage(
            user_id=user_id,
            style_id=style_id,
            output_image_url=output_image_url,
            input_image_url=input_image_url,
            description=description,
        )
        self.db.add(new_image)
        self.db.commit()
        self.db.refresh(new_image)
        return new_image

    def update_image(
        self,
        image_id: int,
        time_taken: Optional[float] = None,
        output_image_url: Optional[str] = None,
        status: Optional[ImageStatus] = None,
    ) -> Optional[GeneratedImage]:
        """Update an existing image object in the database.

        Args:
            image_id (int): ID of the image to update.
            time_taken (Optional[float], optional): Time taken for image generation. Defaults to None.
            output_image_url (Optional[str], optional): URL of the generated image. Defaults to None.
            status (Optional[ImageStatus], optional): Status of the image generation. Defaults to None.

        Returns:
            Optional[GeneratedImage]: The updated image object, or None if not found.
        """
        image = (
            self.db.query(GeneratedImage).filter(GeneratedImage.id == image_id).first()
        )
        if not image:
            return None

        if time_taken is not None:
            image.time_taken = time_taken

        if output_image_url is not None:
            image.output_image_url = output_image_url

        if status is not None:
            image.status = status

        self.db.commit()
        self.db.refresh(image)
        return image

    def update_image_status(
        self,
        image_id: int,
        status,
    ) -> Optional[GeneratedImage]:
        """
        Update the status of an existing image object in the database.

        Args:
            image_id (int): ID of the image to update.
            status (ImageStatus): New status of the image.

        Returns:
            Optional[GeneratedImage]: The updated image object, or None if not found.
        """
        image = (
            self.db.query(GeneratedImage).filter(GeneratedImage.id == image_id).first()
        )
        if not image:
            return None

        image.status = status

        self.db.commit()
        self.db.refresh(image)
        return image

    def get_image_by_id(self, image_id: int) -> Optional[GeneratedImage]:
        """
        Retrieve an image object by its ID.

        Args:
            image_id (int): ID of the image to retrieve.

        Returns:
            Optional[GeneratedImage]: The retrieved image object, or None if not found.
        """
        return (
            self.db.query(GeneratedImage).filter(GeneratedImage.id == image_id).first()
        )

    def get_image_by_user_and_id(
        self, user_id: int, image_id: int
    ) -> Optional[GeneratedImage]:
        """Retrieve an image object by its ID and user ID.

        Args:
            user_id (int): ID of the user who owns the image.
            image_id (int): ID of the image to retrieve.

        Returns:
            Optional[GeneratedImage]: The retrieved image object, or None if not found.
        """
        return (
            self.db.query(GeneratedImage)
            .filter(
                GeneratedImage.id == image_id,
                GeneratedImage.user_id == user_id,
            )
            .first()
        )

    # get images by user id, page and limit (default page is 1 and limit is 10)
    def get_images_by_user_id(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        sort_desc: bool = True,
        favourites: bool = False,
    ) -> List[GeneratedImage]:
        """
        Retrieve images by user ID with pagination.

        Args:
            user_id (int): ID of the user who owns the images.
            page (int): Page number for pagination. Defaults to 1.
            limit (int): Number of images per page. Defaults to 10.
            favourites (bool): If True, fetch only favourite images. Defaults to False.
        Returns:
            List[GeneratedImage]: List of images.
        """
        query = (
            self.db.query(GeneratedImage)
            .options(joinedload(GeneratedImage.style))
            .filter(GeneratedImage.user_id == user_id)
        )

        if favourites:
            query = query.filter(GeneratedImage.liked == favourites)

        if sort_desc:
            query = query.order_by(GeneratedImage.created_at.desc())
        else:
            query = query.order_by(GeneratedImage.created_at.asc())

        return query.offset((page - 1) * limit).limit(limit).all()

    def get_user_input_images(
        self, user_id: int, sort_desc: bool = True, limit: int = 5
    ) -> List[GeneratedImage]:
        """
        Retrieve user input images sorted by creation date.
        Args:
            user_id (int): ID of the user who owns the images.
            sort_desc (bool): Whether to sort in descending order. Defaults to True.
            limit (int): Number of images to retrieve. Defaults to 5.

        Returns:
            List[GeneratedImage]: List of user input images.
        """

        subquery = (
            self.db.query(func.min(GeneratedImage.id).label("id"))
            .filter(GeneratedImage.user_id == user_id)
            .group_by(GeneratedImage.input_image_url)
            .subquery()
        )

        # Main query to get the full image objects
        query = (
            self.db.query(GeneratedImage)
            .filter(GeneratedImage.id.in_(self.db.query(subquery.c.id)))
            .order_by(
                GeneratedImage.created_at.desc()
                if sort_desc
                else GeneratedImage.created_at.asc()
            )
            .limit(limit)
            .all()
        )

        return query

    def like_image(
        self, user_id: int, image_id: int, liked: bool
    ) -> Optional[GeneratedImage]:
        """
        Like or unlike an image.

        Args:
            image_id (int): ID of the image to like or unlike.
            liked (bool): True to like the image, False to unlike.
        Returns:
            Optional[GeneratedImage]: The updated image object, or None if not found.
        """
        image = (
            self.db.query(GeneratedImage)
            .filter(
                GeneratedImage.id == image_id,
                GeneratedImage.user_id == user_id,
            )
            .first()
        )
        if not image:
            return None

        image.liked = liked

        self.db.commit()
        self.db.refresh(image)
        return image

    def count_images_by_user_id(self, user_id: int) -> int:
        """
        Count the total number of images for a given user ID.

        Args:
            user_id (int): ID of the user.
        Returns:
            int: Total number of images for the user.
        """
        return (
            self.db.query(func.count(GeneratedImage.id))
            .filter(GeneratedImage.user_id == user_id)
            .scalar()
        )
