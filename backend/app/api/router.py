"""
Main API router for version 1 endpoints.

This module aggregates all v1 API routers under the /api/v1 prefix.

Routes included:
- /api/v1/auth/*: Authentication and OAuth endpoints
- /api/v1/user/*: User profile endpoints
- /api/v1/files/*: File upload and management endpoints
- /api/v1/image/*: Image processing and management endpoints
- /api/v1/payment/*: Payment endpoints
"""

from .v1 import (
    auth_router,
    files_upload_router,
    image_router,
    user_router,
    payment_router,
)
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(user_router)
router.include_router(files_upload_router)
router.include_router(image_router)
router.include_router(payment_router)
