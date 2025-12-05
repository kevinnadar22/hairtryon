#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: google.py
Author: Maria Kevin
Created: 2025-11-19
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.config import settings
from core.dependencies import AuthServiceDep, GoogleAuthServiceDep
from core.exceptions import GoogleAuthException
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

router = APIRouter()


@router.get("/google")
async def google_login(request: Request, google_auth_service: GoogleAuthServiceDep):
    """
    Initiate Google OAuth authentication flow.

    Args:
        request (Request): FastAPI request object.

    Returns:
        RedirectResponse: Redirect to Google OAuth consent screen.
    """
    return await google_auth_service.authorize_redirect(request)


@router.get(
    "/google/callback", responses={400: {"detail": "Google authentication failed"}}
)
async def google_auth(
    request: Request,
    google_auth_service: GoogleAuthServiceDep,
    auth_service: AuthServiceDep,
):
    """
    Handle Google OAuth callback and create user session.

    Args:
        request (Request): FastAPI request object containing OAuth callback data.
        db (Session): Database session.

    Returns:
        RedirectResponse: Redirect to frontend with access token.

    Raises:
        HTTPException: If Google authentication fails.
    """
    try:
        token = await google_auth_service.handle_authorization_callback(request)
        redirect_url = f"{settings.FRONTEND_URL}/auth/callback?success=true"
    except GoogleAuthException as e:
        token = None
        redirect_url = f"{settings.FRONTEND_URL}/auth/callback?error={e.detail}"

    response = RedirectResponse(redirect_url)
    if token:
        response = auth_service.inject_cookies(response, token)
    return response
