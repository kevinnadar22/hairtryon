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


import uuid

from core.config import settings
from core.exceptions import (
    InvalidWebhookException,
    TransactionNotFoundException,
    UserNotFoundException,
)
from db import Session
from dodopayments import AsyncDodoPayments
from dodopayments.types import CheckoutSessionResponse
from dodopayments.types.checkout_session_status import CheckoutSessionStatus
from enums import IntentStatus
from fastapi import Request
from models import Transaction
from repository import TransactionRepository, UserRepository
from schemas import WebhookRequest


class PaymentService:
    """Service for handling payment operations with Dodo Payments."""

    def __init__(self, session: Session):
        self.session = session
        self.client = AsyncDodoPayments(
            bearer_token=settings.DODO_PAYMENTS_API_KEY,
            environment=settings.DODO_PAYMENTS_MODE,
        )
        self.transaction_repository = TransactionRepository(self.session)
        self.user_repository = UserRepository(self.session)

    async def create_checkout_session(
        self, user_id, quantity: int
    ) -> CheckoutSessionResponse:
        """Create a checkout session."""
        trx = self.transaction_repository.create_transaction(
            session_id=uuid.uuid4().hex,  # temporary session id
            user_id=user_id,
            product_id=settings.DODO_PAYMENTS_PRODUCT_ID,
            amount=quantity,
            status=IntentStatus.PROCESSING,
            quantity=quantity,
        )
        checkout_session_response: CheckoutSessionResponse = (
            await self.client.checkout_sessions.create(
                product_cart=[
                    {
                        "product_id": settings.DODO_PAYMENTS_PRODUCT_ID,
                        "quantity": quantity,
                    }
                ],
                return_url=f"{settings.FRONTEND_URL}/payment",
            )
        )
        trx.session_id = checkout_session_response.session_id
        self.transaction_repository.update_transaction(trx)
        return checkout_session_response

    def get_checkout_session_url(self, response: CheckoutSessionResponse) -> str:
        """Get the checkout session URL from the response."""
        return response.checkout_url

    async def get_checkout_session(self, session_id: str) -> CheckoutSessionStatus:
        """Verify the payment status of a checkout session."""
        checkout_session_response: CheckoutSessionStatus = (
            await self.client.checkout_sessions.retrieve(id=session_id)
        )
        return checkout_session_response

    async def is_paid(self, session_id: str) -> bool:
        """Check if the checkout session is paid."""
        checkout_session_response: CheckoutSessionStatus = (
            await self.client.checkout_sessions.retrieve(id=session_id)
        )
        return checkout_session_response.payment_status == IntentStatus.SUCCEEDED

    async def handle_webhook(
        self,
        request: Request,
        payload: WebhookRequest,
        webhook_id: str,
    ) -> bool:
        """Handle a webhook request."""
        # currnetly not working
        # try:
        #     self.client.webhooks.unwrap(
        #         str(await request.body()),
        #         headers=request.headers,
        #         key=settings.DODO_PAYMENTS_WEBHOOK_SECRET,
        #     )
        # except Exception as e:
        #     print(e, file=open("error.log", "a"))
        #     raise InvalidWebhookException() from e

        session_id = payload.data.checkout_session_id
        event_type = payload.type
        transaction = self.transaction_repository.get_transaction_by_session_id(
            session_id
        )
        if not transaction:
            raise TransactionNotFoundException()
        user = self.user_repository.get_user_by_id(transaction.user_id)

        if user is None:
            raise UserNotFoundException()

        if transaction.webhook_id is not None:
            return True

        transaction.webhook_id = webhook_id
        self.transaction_repository.update_transaction(transaction)

        credits_to_add = payload.data.product_cart[0].quantity

        if event_type == "payment.succeeded":
            self.user_repository.inc_user_credits(user, credits_to_add)

            transaction.credits_added = credits_to_add
            transaction.status = IntentStatus.SUCCEEDED
            transaction.payment_id = payload.data.payment_id
            self.transaction_repository.update_transaction(transaction)

        elif event_type == "payment.failed":
            transaction.status = IntentStatus.FAILED
            self.transaction_repository.update_transaction(transaction)

        elif event_type == "payment.cancelled":
            transaction.status = IntentStatus.CANCELLED
            self.transaction_repository.update_transaction(transaction)

        else:
            raise InvalidWebhookException()

        return True

    def get_transaction_by_payment_id(
        self, payment_id: str, user_id: int
    ) -> Transaction:
        return self.transaction_repository.get_transaction_by_payment_id(
            payment_id, user_id
        )

    def get_transactions_by_user_id(
        self, user_id: int, status: IntentStatus = IntentStatus.SUCCEEDED
    ) -> list[Transaction]:
        return self.transaction_repository.get_transactions_by_user_id(user_id, status)
