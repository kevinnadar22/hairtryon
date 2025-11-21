#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: common.py
Author: Maria Kevin
Created: 2025-11-19
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


# check-email-status


from core.dependencies import AuthServiceDep
from core.exceptions import UserNotFoundException
from fastapi import APIRouter
from schemas import (CheckEmailStatusRequest, CheckEmailStatusResponse,
                     VerifyCodeTokenRequest, VerifyCodeTokenResponse)

router = APIRouter()


@router.post("/check-email-status", response_model=CheckEmailStatusResponse)
async def check_email_status(
    payload: CheckEmailStatusRequest,
    auth_service: AuthServiceDep,
):
    """
    Check if the email is verified.

    Args:
        payload (CheckEmailStatusRequest): Request containing the user's email.
        auth_service (AuthService): Authentication service.
    Returns:
        CheckEmailStatusResponse: Response indicating if the email is verified.
    """
    user = auth_service.get_user_by_email(payload.email)
    if not user:
        raise UserNotFoundException()
    return CheckEmailStatusResponse(verified=user.verified)


@router.post(
    "/verify-code-token",
    response_model=VerifyCodeTokenResponse,
    responses={400: {"detail": "Invalid verification token"}},
)
async def verify_code_token(
    payload: VerifyCodeTokenRequest,
    auth_service: AuthServiceDep,
):
    """
    Verify the validity of a signup/login verification token.

    Args:
        payload (VerifyCodeTokenRequest): JWT token containing the verification code.

    Returns:
        dict: Response indicating if the token is valid.
    """
    valid = auth_service.verify_code_token(payload.token)
    return VerifyCodeTokenResponse(valid=valid is not None)
