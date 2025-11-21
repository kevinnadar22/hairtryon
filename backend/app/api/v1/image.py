"""
image.py
---------------
Handles image generation workflow:
- /image/generate : initiate image generation
- /image/status/{image_id} : retrieve generation status
- /image/styles : list available styles
"""

from typing import List

from core.dependencies import get_current_user
from core.exceptions import ImageNotFoundException
from db import get_db
from fastapi import APIRouter, BackgroundTasks, Depends
from models import User
from schemas import (ImageGenRequest, ImageGenResponse, ImageGenStatusResponse,
                     StylesResponse)
from services import ImageGenService

router = APIRouter(prefix="/image", tags=["image"])


@router.post("/generate", response_model=ImageGenResponse)
async def generate_image(
    data: ImageGenRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> ImageGenResponse:
    """
    Initiate an image generation request.

    Args:
        data (ImageGenRequest): User input including style ID and input image URL.
        background_tasks (BackgroundTasks): FastAPI background task handler.
        current_user (User): Authenticated user via dependency.
        db: Database session.

    Returns:
        ImageGenResponse: Contains image_id and confirmation message.

    Raises:
        HTTPException: If database record creation fails.
    """
    service = ImageGenService(db=db)

    image = service.create_image_generation_record(
        style_id=data.style_id,
        input_image_url=str(data.image_input_url),
        user_id=current_user.id,
    )

    background_tasks.add_task(service.start_image_generation, image)

    return ImageGenResponse(
        image_id=image.id, message="Image generation started successfully."
    )


@router.get(
    "/status/{image_id}",
    response_model=ImageGenStatusResponse,
    responses={404: {"description": "Image not found"}},
)
async def get_image_status(
    image_id: int,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> ImageGenStatusResponse:
    """
    Retrieve image generation status and results.

    Args:
        image_id (int): ID of the image generation record.
        current_user (User): Authenticated user via dependency.
        db: Database session.

    Returns:
        ImageGenStatusResponse: Status and output URL if completed.

    Raises:
        HTTPException: If image not found or doesn't belong to user.
    """
    service = ImageGenService(db=db)
    image_record = service.get_image_record(image_id=image_id, user_id=current_user.id)

    if not image_record:
        raise ImageNotFoundException()

    return image_record


@router.get("/styles", response_model=List[StylesResponse])
async def get_image_styles(
    db=Depends(get_db),
) -> List[StylesResponse]:
    """
    Retrieve all available hairstyles.

    Args:
        current_user (User): Authenticated user via dependency.
        db: Database session.

    Returns:
        List[StylesResponse]: List of available styles with metadata.
    """
    service = ImageGenService(db=db)
    styles = service.get_available_styles()
    return styles  # type: ignore (Fast API will handle serialization)


@router.post("/like/{image_id}")
async def like_image(
    image_id: int,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> dict:
    """
    Like an image generation record.

    Args:
        image_id (int): ID of the image generation record.
        current_user (User): Authenticated user via dependency.
        db: Database session.

    Returns:
        bool: True if liked successfully, False otherwise.

    Raises:
        HTTPException: If image not found or doesn't belong to user.
    """
    service = ImageGenService(db=db)
    result = service.like_image(image_id=image_id, user_id=current_user.id)
    return {"liked": result}


@router.post("/dislike/{image_id}")
async def dislike_image(
    image_id: int,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> dict:
    """
    Dislike an image generation record.

    Args:
        image_id (int): ID of the image generation record.
        current_user (User): Authenticated user via dependency.
        db: Database session.

    Returns:
        bool: True if disliked successfully, False otherwise.

    Raises:
        HTTPException: If image not found or doesn't belong to user.
    """
    service = ImageGenService(db=db)
    result = service.dislike_image(image_id=image_id, user_id=current_user.id)
    return {"disliked": result}
