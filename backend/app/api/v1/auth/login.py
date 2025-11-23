#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: login.py
Author: Maria Kevin
Created: 2025-11-19
Description: Login and token request endpoints
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.dependencies import (
    AuthServiceDep,
    MailServiceDep,
    UseAndBlacklistRefreshToken,
    UseAndBlacklistVerifyToken,
)
from core.exceptions import UserNotVerifiedException, InvalidCredentialsException
from enums import TokenType
from fastapi import APIRouter, BackgroundTasks
from schemas import (
    RequestLoginTokenRequest,
    RequestLoginTokenResponse,
    VerifyLoginRequest,
    VerifyLoginResponse,
)

router = APIRouter()


@router.post(
    "/request-login-token",
    response_model=RequestLoginTokenResponse,
    responses={
        400: {"detail": "User is not verified"},
        404: {"detail": "User not found"},
    },
)
async def request_login_token(
    payload: RequestLoginTokenRequest,
    background_tasks: BackgroundTasks,
    mail_service: MailServiceDep,
    auth_service: AuthServiceDep,
) -> RequestLoginTokenResponse:
    """
    Request a new login verification token.

    Args:
        payload (RequestLoginTokenRequest): Request containing the user's email and password.
        db (Session): Database session.

    Returns:
        RequestLoginTokenResponse: New login verification token.
    """

    user = auth_service.authenticate_user(payload.email, payload.password)
    if not user:
        raise InvalidCredentialsException()

    if not user.verified:
        raise UserNotVerifiedException()

    login_verify_token = auth_service.issue_verification_code(
        user, background_tasks, mail_service, mail_type="login"
    )
    return RequestLoginTokenResponse(token=login_verify_token)


@router.post(
    "/verify-login",
    responses={400: {"detail": "Invalid verification code"}},
    response_model=VerifyLoginResponse,
)
async def verify_login(
    payload: VerifyLoginRequest,
    token: UseAndBlacklistVerifyToken,
    auth_service: AuthServiceDep,
):
    """
    Verify user's email using the login verification code.

    Args:
        payload (VerifyLoginRequest): JWT token containing the verification code.
        auth_service (AuthService): Authentication service.

    Returns:
        VerifyLoginResponse: Response containing access token and verification status.

    Raises:
        HTTPException: If verification code is invalid.
    """

    # Verify the signup code
    user = auth_service.verify_login(payload.token, payload.code)

    # blacklist the signup token after successful verification
    auth_service.token_repository.blacklist_token(
        token, token_type=TokenType.LOGIN_VERIFY
    )

    logged_in_user = auth_service.login_user(
        email=user.email, password=user.hashed_password, user=user
    )

    return auth_service.login_user_with_cookies(logged_in_user)


@router.post("/logout")
async def logout(
    auth_service: AuthServiceDep, refresh_token: UseAndBlacklistRefreshToken
):
    """Logout user and clear cookies.

    Args:
        auth_service (AuthServiceDep): Authentication service.

    Returns:
        JSONResponse: JSON response with cookies cleared.
    """
    return auth_service.logout_user()


@router.post(
    "/refresh",
    responses={400: {"detail": "Invalid authentication credentials"}},
    response_model=VerifyLoginResponse,
)
async def refresh(
    refresh_token: UseAndBlacklistRefreshToken, auth_service: AuthServiceDep
):
    """Refresh user's access token.

    Args:
        refresh_token (ValidRefreshTokenDep): Refresh token.

    Returns:
        JSONResponse: JSON response containing new access token.
    """
    return auth_service.refresh_user(refresh_token=refresh_token)
