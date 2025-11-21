"""
User profile API routes for authenticated users.

This FastAPI router module handles user profile operations.

Routes included:
- GET /user/me: Retrieve current authenticated user profile
"""

from typing import List

from core.dependencies import get_current_user
from db import get_db
from fastapi import APIRouter, Depends
from pydantic import HttpUrl
from schemas import UserBase, UserImagesResponse
from services import ImageGenService

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/me", response_model=UserBase)
async def read_current_user(current_user=Depends(get_current_user)) -> UserBase:
    """
    Retrieve authenticated user profile.

    Args:
        current_user (User): Authenticated user via dependency.

    Returns:
        UserBase: Current user information.
    """
    return current_user


@router.get("/images", response_model=UserImagesResponse)
async def get_user_images(
    favourites: bool = False,
    page: int = 1,
    limit: int = 10,
    sort_desc: bool = True,
    current_user: UserBase = Depends(get_current_user),
    db=Depends(get_db),
) -> UserImagesResponse:
    """
    Retrieve user's generated images.

    Args:
        favourites (bool): If True, fetch only favourite images. Defaults to False.
        page (int): Page number for pagination. Defaults to 1.
        limit (int): Number of images per page. Defaults to 10.
        current_user (User): Authenticated user via dependency.
        db: Database session.
    """
    service = ImageGenService(db=db)
    images = service.get_images_by_user_id(
        user_id=current_user.id,
        page=page,
        limit=limit,
        sort_desc=sort_desc,
        favourites=favourites,
    )
    return images


@router.get("/uploads", response_model=List[HttpUrl])
async def get_user_uploads(
    current_user: UserBase = Depends(get_current_user),
    db=Depends(get_db),
) -> List[HttpUrl]:
    """
    Retrieve URLs of user's uploaded images.

    Args:
        current_user (User): Authenticated user via dependency.
        db: Database session.

    Returns:
        List[HttpUrl]: List of URLs of uploaded images.
    """
    service = ImageGenService(db=db)
    uploads = service.get_user_input_images(user_id=current_user.id)
    return uploads
