"""
Style database model.

This module defines the SQLAlchemy ORM model for hairstyle templates
including prompts, categories, and reference images.
"""

from db import Base
from enums import StyleCategory
from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Styles(Base):
    __tablename__ = "styles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(length=100), nullable=False)
    description: Mapped[str] = mapped_column(String(length=500), nullable=True)
    prompt: Mapped[str] = mapped_column(String(length=2000), nullable=False)
    category: Mapped[StyleCategory] = mapped_column(Enum(StyleCategory), nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=False)

    generated_images = relationship("GeneratedImage", back_populates="style")
