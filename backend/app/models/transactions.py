#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: transactions.py
Author: Maria Kevin
Created: 2025-11-22
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


import datetime

from db import Base
from enums import IntentStatus
from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Transaction(Base):
    __tablename__ = "transactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(
        String, nullable=False
    )  # checkout session id
    payment_id: Mapped[str] = mapped_column(
        String, nullable=True
    )  # payment intent id after payment is completed
    product_id: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    amount: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[IntentStatus] = mapped_column(Enum(IntentStatus), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    credits_added: Mapped[int] = mapped_column(Integer, nullable=True)
    webhook_id: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.datetime.now(),
        server_default=func.now(),
    )

    user = relationship("User", back_populates="transactions")
