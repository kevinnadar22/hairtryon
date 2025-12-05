#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: transaction_repository.py
Author: Maria Kevin
Created: 2025-11-22
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from db import Session
from enums import IntentStatus
from models import Transaction


class TransactionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_transaction(
        self,
        session_id: str,
        user_id: int,
        product_id: str,
        amount: int,
        status: IntentStatus,
        quantity: int,
    ):
        transaction = Transaction(
            session_id=session_id,
            user_id=user_id,
            product_id=product_id,
            amount=amount,
            status=status,
            quantity=quantity,
        )
        self.session.add(transaction)
        self.session.commit()
        self.session.refresh(transaction)
        return transaction

    def get_transaction_by_id(self, transaction_id: int):
        return (
            self.session.query(Transaction)
            .filter(Transaction.id == transaction_id)
            .first()
        )

    def get_transaction_by_session_id(self, session_id: str):
        return (
            self.session.query(Transaction)
            .filter(Transaction.session_id == session_id)
            .first()
        )

    def update_transaction(self, transaction: Transaction):
        self.session.add(transaction)
        self.session.commit()

    def get_transaction_by_payment_id(self, payment_id: str, user_id: int):
        return (
            self.session.query(Transaction)
            .filter(Transaction.payment_id == payment_id)
            .filter(Transaction.user_id == user_id)
            .first()
        )

    def get_transactions_by_user_id(self, user_id: int, status: IntentStatus):
        # sort desc created_at and id
        return (
            self.session.query(Transaction)
            .filter(Transaction.user_id == user_id)
            .filter(Transaction.status == status)
            .order_by(Transaction.created_at.desc(), Transaction.id.desc())
            .all()
        )
