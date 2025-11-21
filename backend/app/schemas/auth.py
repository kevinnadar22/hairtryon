"""
Authentication Pydantic schemas for request/response validation.

This module defines data validation schemas for user authentication
including signup, login, and Google OAuth responses.
"""

from typing import Optional

from pydantic import (BaseModel, ConfigDict, EmailStr, Field, HttpUrl,
                      field_validator, model_validator)


class CookiesModel(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None



class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    userpic: Optional[HttpUrl] = None

    @field_validator("password")
    def validate_password(cls, value: str) -> str:
        if " " in value:
            raise ValueError("Password must not contain spaces")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class SignupUserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    verified: bool
    verify_token: Optional[str] = None

    # from_attributes = True
    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    refresh_token: str
    access_token: str
    token_type: str


class GoogleUserInfo(BaseModel):
    sub: str
    email: EmailStr
    email_verified: bool
    name: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    picture: Optional[HttpUrl] = None
    locale: Optional[str] = None
    iss: Optional[str] = None
    aud: Optional[str] = None
    azp: Optional[str] = None
    at_hash: Optional[str] = None
    nonce: Optional[str] = None
    iat: Optional[int] = None
    exp: Optional[int] = None


class GoogleOAuthToken(BaseModel):
    access_token: str
    expires_in: int
    scope: str
    token_type: str
    id_token: Optional[str] = None
    refresh_token: Optional[str] = None
    userinfo: Optional[GoogleUserInfo] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetTokenRequest(BaseModel):
    token: str


class VerifyResetTokenResponse(BaseModel):
    valid: bool


class CommentResponse(BaseModel):
    detail: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("new_password")
    def validate_new_password(cls, value: str) -> str:
        if " " in value:
            raise ValueError("Password must not contain spaces")
        return value

    @model_validator(mode="before")
    def check_passwords_match(cls, values):
        new_password = values.get("new_password")
        confirm_password = values.get("confirm_password")
        if new_password != confirm_password:
            raise ValueError("New password and confirm password do not match.")
        return values


class VerifySignupRequest(BaseModel):
    token: str
    code: str


class VerifySignupResponse(BaseModel):
    verified: bool



class VerifyCodeTokenRequest(BaseModel):
    token: str


class VerifyCodeTokenResponse(BaseModel):
    valid: bool


class RequestSignupTokenRequest(BaseModel):
    email: EmailStr


class RequestSignupTokenResponse(BaseModel):
    token: str


class CheckEmailStatusRequest(BaseModel):
    email: EmailStr


class CheckEmailStatusResponse(BaseModel):
    verified: bool


class RequestLoginTokenResponse(BaseModel):
    token: str


class RequestLoginTokenRequest(BaseModel):
    email: str
    password: str


class VerifyLoginRequest(VerifySignupRequest):
    ...

class VerifyLoginResponse(VerifySignupResponse):
    ...