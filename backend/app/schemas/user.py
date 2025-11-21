"""
User Pydantic schemas for request/response validation.

This module defines data validation schemas for user profile information.
"""


from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Response schema for user's profile."""
    id: int
    name: str
    email: EmailStr
    userpic: str | None


