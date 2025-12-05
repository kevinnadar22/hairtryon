"""
Application configuration settings using Pydantic.

This module defines configuration classes for authentication, database,
and image upload settings. All settings are loaded from environment variables.
"""

from typing import Literal, Optional

from dotenv import load_dotenv
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

# This is needed even though we use BaseSettings which loads .env automatically
# Because some libraries may rely on environment variables being set at import time
load_dotenv()


class Settings(BaseSettings):
    """Application configuration settings."""

    DATABASE_URL: str = "sqlite:///./app/instance/test.db"

    # Other
    FREE_USER_CREDITS: int = 3
    PORT: int = 8000
    LOGFIRE_TOKEN: Optional[str] = None
    ENV: Literal["dev", "prod"] = "dev"

    # Auth Configurations
    SECRET_KEY: str = "your-secret"
    REFRESH_SECRET_KEY: str = "your-refresh-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10  # 10 minutes
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    REDIRECT_URL: str
    FRONTEND_URL: str

    # Image upload settings and AWS S3 configuration
    MAX_IMAGE_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/gif"]

    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "ap-south-1"
    BUCKET_NAME: str = "hairtry"
    CDN_DOMAIN: str | None = None

    UPLOADS_FOLDER: str = "uploads/"
    GENERATED_IMAGES_FOLDER: str = "generated/"
    PROFILE_PICS_FOLDER: str = "profilepic/"

    # Third party API keys
    REPLICATE_API_TOKEN: str

    # Email settings
    MAIL_FROM_NAME: str
    MAIL_FROM: str
    BREVO_API_KEY: str

    # Admin Panel settings
    ADMIN_USERNAME: str | None = "admin"
    ADMIN_PASSWORD: str | None = "12345678"

    # Payment API Key
    DODO_PAYMENTS_API_KEY: str
    DODO_PAYMENTS_MODE: Literal["test_mode", "live_mode"] = "test_mode"
    DODO_PAYMENTS_PRODUCT_ID: str
    DODO_PAYMENTS_WEBHOOK_SECRET: str

    @property
    def IS_PROD(self) -> bool:
        return self.ENV == "prod"

    model_config = ConfigDict(env_file=".env", extra="ignore")  # type: ignore


settings = Settings()  # type: ignore
