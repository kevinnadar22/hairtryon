"""
User database model.

This module defines the SQLAlchemy ORM model for user accounts
including authentication credentials and profile information.
"""

from db import Base
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.config import settings


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(
        String(length=100), nullable=True, server_default="unknown"
    )
    email: Mapped[str] = mapped_column(String(length=150), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(length=128), nullable=False)
    userpic: Mapped[str] = mapped_column(String, nullable=True)
    verified: Mapped[bool] = mapped_column(nullable=False, server_default="false")
    credits: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default=str(settings.FREE_USER_CREDITS)
    )

    generated_images = relationship("GeneratedImage", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
