#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: blacklist_tokens.py
Author: Maria Kevin
Created: 2025-11-18
Description: Blacklist Tokens
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from db import Base
from enums import TokenType
from sqlalchemy import DateTime, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column


class BlackListTokens(Base):
    __tablename__ = "blacklist_tokens"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    jti: Mapped[str] = mapped_column(String(36), nullable=False, unique=True)
    token_type: Mapped[TokenType] = mapped_column(Enum(TokenType), nullable=False)
    blacklisted_on: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
