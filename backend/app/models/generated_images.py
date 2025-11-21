"""
Generated image database model.

This module defines the SQLAlchemy ORM model for tracking image generation
requests, their status, and associated input/output URLs.
"""

import datetime

from db import Base
from enums import ImageStatus
from sqlalchemy import (Boolean, DateTime, Enum, Float, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class GeneratedImage(Base):
    """Generated image database model."""

    __tablename__ = "generated_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    style_id: Mapped[int] = mapped_column(Integer, ForeignKey("styles.id"), nullable=False)

    description: Mapped[str] = mapped_column(String, nullable=True)
    output_image_url: Mapped[str] = mapped_column(String, nullable=True)
    input_image_url: Mapped[str] = mapped_column(String, nullable=False)

    right_view_url: Mapped[str | None] = mapped_column(String, nullable=True)
    left_view_url: Mapped[str | None] = mapped_column(String, nullable=True)
    back_view_url: Mapped[str | None] = mapped_column(String, nullable=True)

    liked: Mapped[bool] = mapped_column(Boolean, default=None, nullable=True)

    status: Mapped[ImageStatus] = mapped_column(Enum(ImageStatus), default=ImageStatus.PENDING)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    # new field
    time_taken: Mapped[float] = mapped_column(Float, nullable=True)

    user = relationship("User", back_populates="generated_images")
    style = relationship("Styles", back_populates="generated_images")
