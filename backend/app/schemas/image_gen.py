"""
Image generation Pydantic schemas for request/response validation.

This module defines data validation schemas for image generation requests,
responses, styles, and status tracking.
"""

import datetime

from enums import ImageStatus
from pydantic import BaseModel, ConfigDict, HttpUrl
from typing_extensions import Annotated


class ImageGenRequest(BaseModel):
    image_input_url: HttpUrl
    style_id: Annotated[int, "DB Identifier for the desired image style"]


class ImageGenResponse(BaseModel):
    image_id: int
    message: str = "Image generation started successfully."


class StylesResponse(BaseModel):
    id: int
    name: str
    category: str
    image_url: HttpUrl

    model_config = ConfigDict(from_attributes=True)


class ImageGenStatusResponse(BaseModel):
    id: int
    status: ImageStatus
    description: str | None
    output_image_url: HttpUrl | None

    model_config = ConfigDict(from_attributes=True)


class SideViewsResponse(BaseModel):
    right_view_url: HttpUrl
    left_view_url: HttpUrl
    back_view_url: HttpUrl


class UserImages(BaseModel):
    """Response schema for user's generated images."""

    id: int
    input_image_url: str
    output_image_url: str | None
    description: str | None

    style_name: str

    side_views: SideViewsResponse | None

    status: ImageStatus

    created_at: datetime.datetime
    time_taken: float | None


class UserImagesResponse(BaseModel):
    """Response schema for user's generated images with model config."""

    images: list[UserImages]
    page: int
    limit: int
    next_page: int | None
    total_images: int