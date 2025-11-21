#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: signup.py
Author: Maria Kevin
Created: 2025-11-19
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.dependencies import (AuthServiceDep, MailServiceDep,
                               UseAndBlacklistVerifyToken)
from core.exceptions import UserAlreadyVerifiedException, UserNotFoundException
from enums import TokenType
from fastapi import APIRouter, BackgroundTasks
from schemas import (RequestSignupTokenRequest, RequestSignupTokenResponse,
                     SignupRequest, SignupUserResponse, VerifySignupRequest,
                     VerifySignupResponse)

router = APIRouter()


@router.post(
    "/signup",
    response_model=SignupUserResponse,
    responses={400: {"detail": "Email already registered"}},
)
async def signup(
    request: SignupRequest,
    background_tasks: BackgroundTasks,
    mail_service: MailServiceDep,
    auth_service: AuthServiceDep,
) -> SignupUserResponse:
    """
    Register a new user account.

    Args:
        request (SignupRequest): User registration details including email, password, and name.
        db (Session): Database session.

    Returns:
        SignupUserResponse: Created user information.

    Raises:
        HTTPException: If email is already registered.
    """

    # Create the user
    created_user = auth_service.create_user(request)

    # Issue signup verification code
    signup_verify_token = auth_service.issue_verification_code(
        created_user, background_tasks, mail_service, mail_type="signup"
    )

    return SignupUserResponse(
        id=created_user.id,
        email=created_user.email,
        name=created_user.name,
        verify_token=signup_verify_token,
        verified=created_user.verified,
    )


@router.post(
    "/request-signup-token",
    response_model=RequestSignupTokenResponse,
    responses={
        400: {"detail": "User is already verified"},
        404: {"detail": "User not found"},
    },
)
async def request_signup_token(
    payload: RequestSignupTokenRequest,
    background_tasks: BackgroundTasks,
    mail_service: MailServiceDep,
    auth_service: AuthServiceDep,
) -> RequestSignupTokenResponse:
    """
    Request a new signup verification token.

    Args:
        payload (RequestSignupTokenRequest): Request containing the user's email.
        db (Session): Database session.

    Returns:
        RequestSignupTokenResponse: New signup verification token.
    """

    user = auth_service.get_user_by_email(payload.email)
    if not user:
        raise UserNotFoundException()

    if user.verified:
        raise UserAlreadyVerifiedException()

    signup_verify_token = auth_service.issue_verification_code(
        user, background_tasks, mail_service, mail_type="signup"
    )
    return RequestSignupTokenResponse(token=signup_verify_token)


@router.post(
    "/verify-signup",
    responses={400: {"detail": "Invalid verification code"}},
    response_model=VerifySignupResponse,
)
async def verify_signup(
    payload: VerifySignupRequest,
    token: UseAndBlacklistVerifyToken,
    auth_service: AuthServiceDep,
):
    """
    Verify user's email using the signup verification code.

    Args:
        payload (VerifyEmailRequest): JWT token containing the verification code.
        auth_service (AuthService): Authentication service.

    Returns:
        CommentResponse: Confirmation message about successful verification.

    Raises:
        HTTPException: If verification code is invalid.
    """

    # Verify the signup code
    user = auth_service.verify_signup(payload.token, payload.code)

    # blacklist the signup token after successful verification
    auth_service.token_repository.blacklist_token(
        token, token_type=TokenType.SIGNUP_VERIFY
    )

    logged_in_user = auth_service.login_user(
        email=user.email, password=user.hashed_password, user=user
    )

    return auth_service.login_user_with_cookies(logged_in_user)
