#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: payment.py
Author: Maria Kevin
Created: 2025-11-22
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from datetime import datetime

from enums import IntentStatus
from pydantic import BaseModel


class PaymentSessionRequest(BaseModel):
    quantity: int


class PaymentSessionResponse(BaseModel):
    session_id: str
    checkout_url: str


class ProductCart(BaseModel):
    product_id: str
    quantity: int


class WebhookPayload(BaseModel):
    checkout_session_id: str
    status: str
    product_cart: list[ProductCart]
    payment_id: str


class WebhookRequest(BaseModel):
    type: str
    data: WebhookPayload


class TransactionResponse(BaseModel):
    id: int
    session_id: str
    user_id: int
    product_id: str
    amount: int
    status: IntentStatus
    quantity: int
    created_at: datetime

    model_config = {"from_attributes": True}
