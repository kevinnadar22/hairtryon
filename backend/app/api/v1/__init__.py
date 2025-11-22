from .auth import router as auth_router
from .files_upload import router as files_upload_router
from .image import router as image_router
from .user import router as user_router
from .payment import router as payment_router

__all__ = [
    "auth_router",
    "user_router",
    "files_upload_router",
    "image_router",
    "payment_router",
]
