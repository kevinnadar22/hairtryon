#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: payment.py
Author: Maria Kevin
Created: 2025-11-22
Description: Payment endpoints
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from core.dependencies import PaymentServiceDep, CurrentUser

from core.exceptions import InvalidWebhookException, TransactionNotFoundException
from schemas import (
    PaymentSessionRequest,
    PaymentSessionResponse,
    WebhookRequest,
    TransactionResponse,
)
from fastapi import APIRouter, Header, Request, Response


router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/checkout", response_model=PaymentSessionResponse)
async def create_checkout_session(
    payload: PaymentSessionRequest,
    current_user: CurrentUser,
    payment_service: PaymentServiceDep,
):
    """Create a checkout session."""
    checkout_session_response = await payment_service.create_checkout_session(
        quantity=payload.quantity,
        user_id=current_user.id,
    )
    return PaymentSessionResponse(
        session_id=checkout_session_response.session_id,
        checkout_url=checkout_session_response.checkout_url,
    )


@router.post("/webhook", include_in_schema=False)
async def payment_webhook_handler(
    request: Request,
    payload: WebhookRequest,
    payment_service: PaymentServiceDep,
    webhook_id: str = Header(..., alias="webhook-id"),
):
    """Handle a webhook request."""
    status = await payment_service.handle_webhook(
        request=request,
        payload=payload,
        webhook_id=webhook_id,
    )

    if not status:
        raise InvalidWebhookException()

    return Response(status_code=200)


# get transaction by id
@router.get("/transaction/{payment_id}", response_model=TransactionResponse)
async def get_transaction_by_id(
    payment_id: str,
    payment_service: PaymentServiceDep,
    current_user: CurrentUser,
):
    """Get a transaction by id."""
    response = payment_service.get_transaction_by_payment_id(
        payment_id, user_id=current_user.id
    )
    if not response:
        raise TransactionNotFoundException()
    return response


# get list of transactions by user id
@router.get("/transactions", response_model=list[TransactionResponse])
async def get_transactions_by_user_id(
    payment_service: PaymentServiceDep,
    current_user: CurrentUser,
):
    """Get a list of transactions by user id."""
    return payment_service.get_transactions_by_user_id(user_id=current_user.id)
