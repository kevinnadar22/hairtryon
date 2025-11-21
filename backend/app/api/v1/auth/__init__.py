"""
Authentication API routes for user signup, login, and OAuth.

This FastAPI router module handles all authentication-related endpoints.

Routes included:
- POST /auth/signup: User registration
- POST /auth/login: User login with credentials
- GET /auth/google: Initiate Google OAuth flow
- GET /auth/google/callback: Handle Google OAuth callback
- POST /auth/forgot-password: Request password reset
- POST /auth/verify-reset-token: Verify password reset token
- POST /auth/reset-password: Reset user password
- POST /auth/request-signup-token: Request a new signup verification token
- POST /auth/verify-signup-token: Verify signup verification token
- POST /auth/verify-signup: Verify user's email during signup
"""

from fastapi import APIRouter

from .common import router as common_router
from .google import router as google_router
from .login import router as login_router
from .reset_password import router as reset_password_router
from .signup import router as signup_router

router = APIRouter(prefix="/auth", tags=["auth"])

# Include sub-routers for different authentication functionalities
router.include_router(signup_router)
router.include_router(login_router)
router.include_router(google_router)
router.include_router(reset_password_router)
router.include_router(common_router)
