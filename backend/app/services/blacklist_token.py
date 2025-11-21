#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: blacklist_token.py
Author: Maria Kevin
Created: 2025-11-18
Description: Blacklist token Service
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from enums import TokenType
from repository import TokenRepository
from sqlalchemy.orm import Session
from utils import get_jti_from_token


class BlacklistTokenService:
    """Service to handle blacklisting of tokens."""

    def __init__(self, db: Session):
        self.db = db
        self.token_repository = TokenRepository(db)

    def blacklist_token(self, token: str, token_type: TokenType) -> None:
        """
        Blacklist a JWT token to invalidate it.

        Args:
            token (str): JWT token to blacklist.
        Returns:
            None
        """
        jti = get_jti_from_token(token)
        if jti:
            self.token_repository.blacklist_token(jti, token_type=token_type)
        return None

    def is_token_blacklisted(self, token: str) -> bool:
        """
        Check if a JWT token is blacklisted.

        Args:
            token (str): JWT token to check.
        Returns:
            bool: True if token is blacklisted, False otherwise.
        """

        jti = get_jti_from_token(token)
        if jti:
            return self.token_repository.is_token_blacklisted(jti)
        return False
