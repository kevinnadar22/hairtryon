#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: token_repository.py
Author: Maria Kevin
Created: 2025-11-18
Description: Token repository utilities.
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


import datetime

from db import Session
from enums import TokenType
from models import BlackListTokens


class TokenRepository:
    """Repository for managing blacklisted tokens."""

    def __init__(self, db: Session):
        self.db = db

    def is_token_blacklisted(self, jti: str) -> bool:
        """
        Check if a token is blacklisted.

        Args:
            jti (str): The JWT ID of the token.
        Returns:
            bool: True if the token is blacklisted, False otherwise.
        """
        token = (
            self.db.query(BlackListTokens).filter(BlackListTokens.jti == jti).first()
        )
        return token is not None

    def blacklist_token(
        self,
        jti: str,
        blacklisted_on: datetime.datetime | None = None,
        token_type: TokenType = TokenType.ACCESS,
    ) -> None:
        """
        Blacklist a token by its JWT ID.

        Args:
            jti (str): The JWT ID of the token.
            blacklisted_on (datetime.datetime): The time the token was blacklisted.
        """
        if blacklisted_on is None:
            blacklisted_on = datetime.datetime.now(datetime.timezone.utc)

        blacklisted_token = BlackListTokens(
            jti=jti, blacklisted_on=blacklisted_on, token_type=token_type
        )
        self.db.add(blacklisted_token)
        self.db.commit()
        self.db.commit()
