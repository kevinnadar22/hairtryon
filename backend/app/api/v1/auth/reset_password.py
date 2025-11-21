#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: reset-password.py
Author: Maria Kevin
Created: 2025-11-19
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.config import settings
from core.dependencies import AuthServiceDep, MailServiceDep, UseAndBlacklistResetToken
from core.exceptions import InvalidResetTokenException
from fastapi import APIRouter, BackgroundTasks
from schemas import (
    CommentResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyResetTokenRequest,
    VerifyResetTokenResponse,
)

router = APIRouter()


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    auth_service: AuthServiceDep,
    mail_service: MailServiceDep,
):
    """
    Handles password reset requests.

    args:
        request (ForgotPasswordRequest): Request containing the user's email.

    Returns:
        dict: Confirmation message about password reset email.
    """
    email = request.email

    if not auth_service.is_email_registered(email):
        return {
            "detail": "If the email is registered, a password reset link has been sent."
        }

    token = auth_service.generate_password_reset_token(email)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    background_tasks.add_task(mail_service.send_password_reset_email, email, reset_link)
    return {
        "detail": "If the email is registered, a password reset link has been sent."
    }


@router.post("/verify-reset-token", response_model=VerifyResetTokenResponse)
async def verify_reset_token(
    request: VerifyResetTokenRequest, auth_service: AuthServiceDep
):
    """
    Verify the validity of a password reset token.

    Args:
        request (VerifyResetTokenRequest): Request containing the reset token.
        auth_service (AuthService): Authentication service.
    Returns:
        VerifyResetTokenResponse: Response indicating if the token is valid.
    """
    token = request.token
    email = auth_service.verify_password_reset_token(token)
    if not email:
        raise InvalidResetTokenException()
    return {"valid": True}


@router.post(
    "/reset-password",
    responses={400: {"detail": "Invalid or expired reset token."}},
    response_model=CommentResponse,
)
async def reset_password(
    token: UseAndBlacklistResetToken,
    request: ResetPasswordRequest,
    auth_service: AuthServiceDep,
):
    """
    Reset user's password using a valid reset token.

    Args:
        request (ResetPasswordRequest): Request containing the reset token and new password.
        auth_service (AuthService): Authentication service.
    Returns:
        dict: Confirmation message about successful password reset.
    """
    new_password = request.new_password
    return auth_service.reset_user_password(token, new_password)
