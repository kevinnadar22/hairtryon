"""
Image upload service for AWS S3 integration.

This module provides functionality for generating presigned URLs and
uploading images directly to S3 buckets.
"""

import os

import boto3
from botocore.config import Config
from core.config import settings
from schemas import ImageUploadResponse
from utils import get_file_info, save_image_from_url

s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    config=Config(signature_version="s3v4"),
)


class ImageUploadService:
    """Service to handle image uploads to S3."""

    @staticmethod
    def generate_presigned_url(
        file_path: str,
        expiration: int = 3600,
        file_type: str = "image/jpeg",
    ) -> ImageUploadResponse:
        """
        Generate presigned URL for S3 upload.

        Args:
            file_path (str): Destination path in S3 bucket.
            expiration (int): URL validity duration in seconds.
            file_type (str): MIME type of file to upload.

        Returns:
            ImageUploadResponse: Presigned URL and upload metadata.
        """
        object_name = f"{settings.UPLOADS_FOLDER}{file_path}"

        response = s3_client.generate_presigned_post(
            Bucket=settings.BUCKET_NAME,
            Key=object_name,
            Fields={"Content-Type": file_type},
            Conditions=[
                ["starts-with", "$Content-Type", "image/"],
                [
                    "content-length-range",
                    1,
                    settings.MAX_IMAGE_SIZE_MB * 1024 * 1024,
                ],
            ],
            ExpiresIn=expiration,
        )
        upload_url = response["url"]
        file_url = ImageUploadService.make_url(object_name)

        return ImageUploadResponse(
            file_url=file_url,
            upload_url=upload_url,
            key=object_name,
            fields=response.get("fields"),
        )

    @staticmethod
    def upload_image_to_s3(
        file_path: str,
        file_data: bytes,
        file_type: str,
        folder: str = settings.UPLOADS_FOLDER,
    ) -> str:
        """
        Upload image file directly to S3 bucket.

        Args:
            file_path (str): Destination path in S3 bucket.
            file_data (bytes): Binary file content.
            file_type (str): MIME type of the file.

        Returns:
            str: Public URL of uploaded file.
        """
        object_name = f"{folder}{file_path}"

        s3_client.put_object(
            Bucket=settings.BUCKET_NAME,
            Key=object_name,
            Body=file_data,
            ContentType=file_type,
            # ACL="public-read",
        )

        file_url = ImageUploadService.make_url(object_name)
        return file_url

    # method to save to s3 from url
    @staticmethod
    async def upload_image_from_url(
        image_url: str, folder: str = settings.UPLOADS_FOLDER
    ) -> str:
        """
        Download image from URL and upload to S3.

        Args:
            image_url (str): URL of the image to download.
            folder (str): S3 folder to upload the image to.
        Returns:
            str: Public URL of uploaded image.
        temp_file_path = await save_image_from_url(image_url)
        """
        temp_file_path = await save_image_from_url(image_url)
        try:
            file_info = get_file_info(temp_file_path)
            file_name = file_info["name"]
            file_data = file_info["data"]
            file_type = file_info["mime"] or "application/octet-stream"

            file_url = ImageUploadService.upload_image_to_s3(
                file_path=file_name,
                file_data=file_data,
                file_type=file_type,
                folder=folder,
            )
        finally:
            # Clean up temporary file
            os.remove(temp_file_path)

        return file_url

    @staticmethod
    def make_url(file_path: str) -> str:
        if settings.CDN_DOMAIN:
            return f"https://{settings.CDN_DOMAIN}/{file_path}"
        return f"https://{settings.BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{file_path}"
