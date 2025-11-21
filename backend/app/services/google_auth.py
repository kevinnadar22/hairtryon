"""
Google OAuth authentication service.

This module handles Google OAuth 2.0 authentication flow including
authorization redirect, callback processing, and user creation/retrieval.
"""

import aiohttp
from authlib.integrations.starlette_client import OAuth
from core.config import settings
from core.exceptions import GoogleAuthException
from db import Session
from fastapi import Request
from repository import UserRepository
from schemas import GoogleOAuthToken, GoogleUserInfo
from utils import generate_fake_password

from .auth import AuthService
from .image_upload import ImageUploadService

oauth = OAuth()
oauth.register(
    name="hairtryon",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=settings.REDIRECT_URL,
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={"scope": "openid profile email"},
)


class GoogleAuthService:
    """Service to handle Google OAuth authentication."""

    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.auth_service = AuthService(db)

    @staticmethod
    async def authorize_redirect(request):
        """
        Redirect user to Google OAuth consent screen.

        Args:
            request: FastAPI request object.

        Returns:
            RedirectResponse: Redirect to Google authorization URL.
        """
        redirect_url = settings.REDIRECT_URL
        return await oauth.hairtryon.authorize_redirect(  # type: ignore
            request, redirect_url, prompt="consent"
        )

    async def handle_authorization_callback(self, request: Request):
        """
        Process Google OAuth callback and create/login user.

        Args:
            request (Request): FastAPI request with OAuth callback data.

        Returns:
            TokenResponse: JWT access token for authenticated user.

        Raises:
            GoogleAuthException: If token retrieval or user info fetch fails.
        """
        try:
            token_dict = await oauth.hairtryon.authorize_access_token(request)  # type: ignore
            # print(token_dict, file=open("debug.log", "a"))
            token = GoogleOAuthToken(**token_dict)
        except Exception as e:
            # print(e, file=open("debug.log", "a"))
            raise GoogleAuthException("Failed to retrieve access token") from e

        user = await self.fetch_userinfo(token.access_token)
        token.userinfo = user

        if user is None:
            raise GoogleAuthException("Failed to retrieve user info")

        email = user.email
        user_id = user.sub

        if not email or not user_id:
            raise GoogleAuthException("Email or user ID not found in user info")

        user = await self.create_or_get_user(token)
        logged_in_user = self.auth_service.login_user(
            user=user, email=email, password=user_id
        )
        # return self.auth_service.login_user_with_cookies(logged_in_user)
        return logged_in_user

    async def create_or_get_user(self, token: GoogleOAuthToken):
        """
        Retrieve existing user or create new one from Google OAuth data.

        Args:
            token (GoogleOAuthToken): OAuth token with user information.

        Returns:
            User: Existing or newly created user object.
        """
        assert token.userinfo is not None, "userinfo should never be None here"

        if exists := self.user_repo.get_user_by_email(token.userinfo.email):
            return exists

        email = token.userinfo.email
        password = generate_fake_password()

        userpic = (
            await ImageUploadService.upload_image_from_url(
                image_url=str(token.userinfo.picture),
                folder=settings.PROFILE_PICS_FOLDER,
            )
            if token.userinfo.picture
            else None
        )

        new_user = self.user_repo.create_user(
            email=email,
            hashed_password=password,
            name=token.userinfo.name,
            userpic=userpic,  # type: ignore
            verified=True,
        )

        return new_user

    async def fetch_userinfo(self, access_token: str):
        """
        Fetch user information from Google OAuth API.

        Args:
            access_token (str): Google OAuth access token.

        Returns:
            GoogleUserInfo | None: User information if successful, None otherwise.
        """
        userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with aiohttp.ClientSession() as session:
            async with session.get(userinfo_endpoint, headers=headers) as response:
                if not response.ok:
                    return None
                return GoogleUserInfo(**await response.json())
