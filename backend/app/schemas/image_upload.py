"""
Image upload Pydantic schemas for request/response validation.

This module defines data validation schemas for S3 presigned URL responses.
"""

from pydantic import BaseModel


class ImageUploadResponse(BaseModel):
    file_url: str
    upload_url: str
    key: str
    fields: dict | None = None
