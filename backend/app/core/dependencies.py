"""
FastAPI dependency injection for protected routes.

This module provides authentication dependencies for securing API endpoints.
"""

from core.exceptions import (
    InvalidRefreshTokenException,
    InvalidResetTokenException,
    InvalidSignupTokenException,
    NotAuthenticatedException,
    UserNotFoundException,
    UserNotVerifiedException,
    NoCookiesException,
)
from db import Session, get_db
from enums import TokenType
from fastapi import Cookie, Depends
from models import User
from repository import UserRepository
from schemas import (
    CookiesModel,
    ResetPasswordRequest,
    VerifyLoginRequest,
    VerifySignupRequest,
)
from services import (
    AuthService,
    BlacklistTokenService,
    GoogleAuthService,
    MailService,
    PaymentService,
)
from typing_extensions import Annotated
from utils import decode_access_token


def get_cookies(cookies: Annotated[CookiesModel, Cookie()]) -> CookiesModel:
    return cookies


def get_current_user(
    cookies: CookiesModel = Depends(get_cookies),
    db: Session = Depends(get_db),
) -> User:
    if not cookies.access_token:
        raise NoCookiesException()

    decoded_token = decode_access_token(cookies.access_token)

    if not decoded_token:
        raise NotAuthenticatedException()

    email: str | None = decoded_token.get("sub", None)

    if email is None:
        raise NotAuthenticatedException()

    user_repository = UserRepository(db)

    user = user_repository.get_user_by_email(email)

    if user is None:
        raise NotAuthenticatedException()

    if not user.verified:
        raise UserNotVerifiedException()

    return user


def require_valid_reset_token(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Dependency to manage the lifecycle of a password reset token.
    On entering, it validates the token is not blacklisted.
    On exiting, it blacklists the token to prevent reuse.
    """
    token = request.token
    token_service = BlacklistTokenService(db)
    if token_service.is_token_blacklisted(token):
        raise InvalidResetTokenException()
    try:
        yield token
    finally:
        token_service.blacklist_token(token, TokenType.PASSWORD_RESET)


def require_valid_code_token(
    payload: VerifySignupRequest | VerifyLoginRequest,
    db: Session = Depends(get_db),
):
    """Dependency to validate a signup or login verification token.

    It only checks that the token is not blacklisted.
    It does not blacklist the token after response because
    User can enter wrong code when verifying signup
    and would need to reuse the same token to verify again.
    """
    token = payload.token
    token_service = BlacklistTokenService(db)
    if token_service.is_token_blacklisted(token):
        raise InvalidSignupTokenException()

    yield token


def blacklist_refresh_token(
    cookies: Annotated[CookiesModel, Depends(get_cookies)],
    db: Session = Depends(get_db),
):
    """Dependency to validate a refresh token.

    It only checks that the token is not blacklisted.
    It does not blacklist the token after response because
    User can enter wrong code when verifying signup
    and would need to reuse the same token to verify again.
    """
    token = cookies.refresh_token
    if not token:
        raise UserNotFoundException()
    token_service = BlacklistTokenService(db)
    if token_service.is_token_blacklisted(token):
        raise InvalidRefreshTokenException()
    try:
        yield token
    finally:
        token_service.blacklist_token(token, TokenType.REFRESH)


def get_mail_service():
    return MailService()


def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(db)


def get_google_auth_service(db: Session = Depends(get_db)):
    return GoogleAuthService(db)


def get_payment_service(db: Session = Depends(get_db)):
    return PaymentService(db)


MailServiceDep = Annotated[MailService, Depends(get_mail_service)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
GoogleAuthServiceDep = Annotated[GoogleAuthService, Depends(get_google_auth_service)]
PaymentServiceDep = Annotated[PaymentService, Depends(get_payment_service)]
AuthCookies = Annotated[CookiesModel, Depends(get_cookies)]
UseAndBlacklistRefreshToken = Annotated[str, Depends(blacklist_refresh_token)]
UseAndBlacklistVerifyToken = Annotated[str, Depends(require_valid_code_token)]
UseAndBlacklistResetToken = Annotated[str, Depends(require_valid_reset_token)]
CurrentUser = Annotated[User, Depends(get_current_user)]
