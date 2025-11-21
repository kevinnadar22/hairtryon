"""
File upload API routes for S3 presigned URL generation.

This FastAPI router module handles file upload operations using presigned URLs.

Routes included:
- GET /files/presign: Generate presigned URL for direct S3 upload
"""

import datetime
from typing import Annotated

from core.dependencies import get_current_user
from fastapi import APIRouter, Depends, Query
from schemas import ImageUploadResponse
from services import ImageUploadService

router = APIRouter(prefix="/files", tags=["files"])


@router.get("/presign", response_model=ImageUploadResponse)
async def get_presigned_url(
    file_name: Annotated[str, Query(..., max_length=255)],
    file_type: Annotated[str, Query(..., max_length=100)],
    current_user=Depends(get_current_user),
) -> ImageUploadResponse:
    """
    Generate presigned URL for direct S3 upload.

    Args:
        file_name (str): Name of the file to upload.
        file_type (str): MIME type of the file.
        current_user (User): Authenticated user via dependency.

    Returns:
        ImageUploadResponse: Presigned URL and upload details.
    """

    # we need to append a user-specific folder to avoid name collisions
    file_name = f"user_{current_user.id}/{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{file_name}"
    return ImageUploadService.generate_presigned_url(
        file_path=file_name, file_type=file_type
    )
