"""
User repository for database operations.

This module provides data access layer for User model operations
including retrieval and creation.
"""

from typing import Optional

from db import Session
from models import User


class UserRepository:
    """Repository to handle database operations for User."""

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        """
        Get a user by their email.

        Args:
            email (str): The email of the user to retrieve.

        Returns:
            User | None: The retrieved user object, or None if not found.
        """
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> User | None:
        """
        Get a user by their ID.

        Args:
            user_id (int): The ID of the user to retrieve.

        Returns:
            User | None: The retrieved user object, or None if not found.
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(
        self,
        email: str,
        hashed_password: str,
        verified: bool = False,
        name: Optional[str] = None,
        userpic: Optional[str] = None,
    ) -> User:
        """Create a new user in the database.

        Args:
            email (str): The email of the user.
            hashed_password (str): The hashed password of the user.
            name (Optional[str], optional): The name of the user. Defaults to None.
            userpic (Optional[str], optional): The user picture URL. Defaults to None.

        Returns:
            User: The created user object.
        """
        new_user = User(
            email=email,
            hashed_password=hashed_password,
            verified=verified,
            name=name,
            userpic=userpic,
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def update_user_password(self, user: User, new_hashed_password: str) -> User:
        """
        Update the user's password.

        Args:
            user (User): The user object to update.
            new_hashed_password (str): The new hashed password.

        Returns:
            User: The updated user object.
        """
        user.hashed_password = new_hashed_password
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_user(self, user: User) -> User:
        """
        Update the user details.

        Args:
            user (User): The user object to update.

        Returns:
            User: The updated user object.
        """
        self.db.commit()
        self.db.refresh(user)
        return user

    def mark_user_as_verified(self, user: User) -> User:
        """
        Mark the user as verified.

        Args:
            user (User): The user object to update.
        Returns:
            User: The updated user object with verified status.
        """
        user.verified = True
        self.update_user(user)
        return user
