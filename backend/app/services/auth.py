"""
Authentication service for user registration and login.

This module provides business logic for user authentication including
password hashing, credential verification, and JWT token generation.
"""

import random
import string
from typing import Literal, Optional, TypeVar

from core.config import settings
from core.exceptions import (EmailAlreadyRegisteredException,
                             InvalidCredentialsException,
                             InvalidResetTokenException,
                             NotAuthenticatedException, UserNotFoundException,
                             UserNotVerifiedException,
                             VerificationCodeExpiredException,
                             VerificationCodeInvalidException)
from db import Session
from fastapi import Response
from fastapi.background import BackgroundTasks
from fastapi.responses import JSONResponse
from models import User
from repository import TokenRepository, UserRepository
from schemas import (CommentResponse, SignupRequest, TokenResponse,
                     VerifyLoginResponse)
from utils import (create_access_token, create_refresh_token,
                   decode_access_token, decode_refresh_token, hash_password,
                   verify_password)

R = TypeVar("R", bound=Response)


class AuthService:
    """Service to handle user authentication and registration."""

    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)
        self.token_repository = TokenRepository(db)

    def create_user(self, data: SignupRequest) -> User:
        """
        Create a new user account with hashed password.

        Args:
            data (SignupRequest): User registration data.

        Returns:
            User: Created user object.

        Raises:
            EmailAlreadyRegisteredException: If email is already in use.
        """
        email = data.email
        password = data.password

        if self.is_email_registered(email):
            raise EmailAlreadyRegisteredException()

        # hash the password now
        hashed_password = hash_password(password)

        return self.user_repository.create_user(
            email,
            hashed_password,
            verified=False,
            name=data.name,
            userpic=str(data.userpic) or "",
        )

    def login_user(
        self, email: str, password: str, user: Optional[User] = None
    ) -> TokenResponse:
        """
        Authenticate user and generate access token.

        Args:
            email (str): User email address.
            password (str): User password.
            user (Optional[User]): Pre-authenticated user object (for OAuth).

        Returns:
            TokenResponse: Access token and token type.

        Raises:
            InvalidCredentialsException: If authentication fails.
        """
        if user is None:
            user = self.authenticate_user(email, password)

            if not user:
                raise InvalidCredentialsException()

        if not user.verified:
            raise UserNotVerifiedException()

        access_token = self.generate_access_token(user)
        refresh_token = self.generate_refresh_token(user)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    def is_email_registered(self, email: str) -> bool:
        """
        Check if email already exists in database.

        Args:
            email (str): Email address to check.

        Returns:
            bool: True if email exists, False otherwise.
        """
        return self.user_repository.get_user_by_email(email) is not None

    def authenticate_user(self, email: str, password: str) -> User | None:
        """
        Verify user credentials.

        Args:
            email (str): User email address.
            password (str): Plain text password to verify.

        Returns:
            User | None: User object if valid, None if invalid.
        """
        user = self.user_repository.get_user_by_email(email)
        if user and verify_password(password, user.hashed_password):
            return user
        return None

    def generate_access_token(self, user: User) -> str:
        """
        Generate JWT access token for user.

        Args:
            user (User): User object to encode in token.

        Returns:
            str: JWT access token.
        """
        return create_access_token({"sub": user.email})

    def generate_refresh_token(self, user: User) -> str:
        """
        Generate JWT refresh token for user.

        Args:
            user (User): User object to encode in token.
        Returns:
            str: JWT refresh token.
        """
        return create_refresh_token(
            {"sub": user.email},
            expires_delta_minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES,
        )

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve user by email address.

        Args:
            email (str): Email address to search.

        Returns:
            Optional[User]: User object if found, None otherwise.
        """
        return self.user_repository.get_user_by_email(email)

    def generate_password_reset_token(self, email: str) -> str:
        """
        Generate a password reset token for the given email.

        Args:
            email (str): User email address.
        Returns:
            str: Password reset token.
        return create_access_token({"sub": email}, expires_delta_minutes=15)
        """
        return create_access_token({"sub": email}, expires_delta_minutes=15)

    def verify_password_reset_token(self, token: str) -> Optional[str]:
        """
        Verify the password reset token and extract the email.

        Args:
            token (str): Password reset token.
        Returns:
            Optional[str]: Email address if token is valid, None otherwise.
        """
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            return None
        return payload["sub"]

    def reset_user_password(self, token: str, new_password: str) -> CommentResponse:
        """
        Reset the user's password.

        Args:
            email (str): User email address.
            new_password (str): New plain text password.

        Returns:
            dict: Confirmation message.
        """

        email = self.verify_password_reset_token(token)
        if not email:
            raise InvalidResetTokenException()

        user = self.get_user_by_email(email)
        if not user:
            raise InvalidCredentialsException()

        hashed_password = hash_password(new_password)
        self.user_repository.update_user_password(user, hashed_password)

        return CommentResponse(detail="Password has been reset successfully.")

    def generate_email_verification_code(self, user_id: int) -> str:
        """
        Generate an email verification code for the given email.

        Args:
            user_id (int): User ID.
        Returns:
            str: Email verification code.
        """

        code = "".join(random.choices(string.digits, k=6))
        return code

    def generate_signup_verify_token(self, user_id: int, code: str) -> str:
        """
        Generate a JWT signup verification token containing user ID and code.

        Args:
            user_id (int): User ID.
            code (str): Verification code.
        Returns:
            str: Signup verification token.
        """
        return create_access_token(
            {"sub": str(user_id), "code": code}, expires_delta_minutes=60
        )

    def verify_signup(self, token: str, code: str) -> User:
        """
        Verify the email signup code.

        Args:
            code (str): Email verification code.
            token (str): JWT token containing the verification code.

        Returns:
            User: Verified user object.
        Raises:
            VerificationCodeInvalidException: If verification code is invalid.
            VerificationCodeExpiredException: If verification code has expired.
        """

        # Verify if the code and entered code match
        user = self.verify_login(token, code)

        # Mark user as verified if not already
        if not user.verified:
            self.user_repository.mark_user_as_verified(user)
        return user

    def verify_login(self, token: str, code: str) -> User:
        """
        Verify the email login code.

        Args:
            code (str): Email verification code.
            token (str): JWT token containing the verification code.

        Returns:
            User: Verified user object.
        Raises:
            VerificationCodeInvalidException: If verification code is invalid.
            VerificationCodeExpiredException: If verification code has expired.
        """
        jwt_payload = self.verify_code_token(token)
        if not jwt_payload:
            raise VerificationCodeExpiredException()

        generated_code = jwt_payload["code"]
        user_id = int(jwt_payload["sub"])

        if generated_code != code:
            raise VerificationCodeInvalidException()

        user = self.user_repository.get_user_by_id(user_id)

        if not user:
            raise InvalidCredentialsException()

        return user

    def verify_code_token(self, token: str) -> Optional[dict]:
        """
        Verify the validity of a signup/ login verification token.

        Args:
            token (str): JWT token containing the verification code.

        Returns:
            bool: True if token is valid, False otherwise.
        """
        jwt_payload = decode_access_token(token)
        if not jwt_payload or "sub" not in jwt_payload or "code" not in jwt_payload:
            return None
        return jwt_payload

    def issue_verification_code(
        self,
        user: User,
        background_tasks: BackgroundTasks,
        mail_service,
        mail_type: Literal["signup", "login"],
    ) -> str:
        """
        Issue a new signup/login verification code for the user.

        Args:
            user (User): User object.
            background_tasks (BackgroundTasks): FastAPI background tasks manager.
            mail_service (MailServiceDep): Mail service dependency.

        Returns:
            str: New verification code.
        """
        signup_code = self.generate_email_verification_code(user.id)

        if mail_type == "login":
            func = mail_service.send_login_otp_email
        else:
            func = mail_service.send_signup_verification_email

        background_tasks.add_task(
            func,
            user.email,
            user.name,
            signup_code,
        )
        signup_verify_token = self.generate_signup_verify_token(user.id, signup_code)
        return signup_verify_token

    def login_user_with_cookies(self, token_response: TokenResponse) -> JSONResponse:
        """
        Login user and set cookies for access and refresh tokens.

        Args:
            user (User): User object.

        Returns:
            JSONResponse: JSON response containing access and refresh tokens.
        """

        pydantic_response = VerifyLoginResponse(
            verified=True,
        )

        response = JSONResponse(status_code=200, content=pydantic_response.model_dump())

        response = self.inject_cookies(response, token_response)
        return response

    def inject_cookies(self, response: R, token_response: TokenResponse) -> R:
        """
        Inject access and refresh tokens into the response cookies.

        Args:
            response (JSONResponse): JSON response object.
            token_response (TokenResponse): Token response object containing access and refresh tokens.

        Returns:
            JSONResponse: JSON response with cookies set.
        """
        response.set_cookie(
            "refresh_token",
            value=token_response.refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        )
        response.set_cookie(
            "access_token",
            value=token_response.access_token,
            httponly=True,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        return response

    def logout_user(self) -> JSONResponse:
        """
        Logout user and clear cookies.

        Returns:
            JSONResponse: JSON response with cookies cleared.
        """
        response = JSONResponse(status_code=200, content={"message": "User logged out"})
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        return response

    def refresh_user(self, refresh_token: str) -> JSONResponse:
        """
        Refresh user's access token.

        Args:
            refresh_token (str): Refresh token.

        Returns:
            JSONResponse: JSON response containing new access token.
        """
        # decode refresh token
        decoded_refresh_token = decode_refresh_token(refresh_token)

        if not decoded_refresh_token:
            raise NotAuthenticatedException()

        user = self.get_user_by_email(decoded_refresh_token["sub"])

        if not user:
            raise UserNotFoundException()

        if not user.verified:
            raise UserNotVerifiedException()

        access_token = self.generate_access_token(user)
        refresh_token = self.generate_refresh_token(user)

        token_response = TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

        return self.login_user_with_cookies(token_response)
