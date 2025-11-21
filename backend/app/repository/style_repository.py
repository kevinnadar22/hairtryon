"""
Style repository for database operations.

This module provides data access layer for Styles model operations
including retrieval of styles by ID and listing all available styles.
"""

from typing import List, Optional

from db import Session
from models import Styles


class StyleRepository:
    """Repository to handle database operations for Styles."""

    def __init__(self, db: Session):
        self.db = db

    def get_style_by_id(self, style_id: int) -> Optional[Styles]:
        """Retrieve a style object by its ID.

        Args:
            style_id (int): ID of the style to retrieve.

        Returns:
            Optional[Styles]: The retrieved style object, or None if not found.
        """
        return self.db.query(Styles).filter(Styles.id == style_id).first()

    def get_all_styles(self) -> List[Styles]:
        """
        Get all available styles.

        Returns:
            List[Styles]: The list of all available styles.
        """
        return self.db.query(Styles).all()
