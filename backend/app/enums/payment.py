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


from enum import Enum


class IntentStatus(Enum):
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PROCESSING = "processing"
    REQUIRES_CUSTOMER_ACTION = "requires_customer_action"
    REQUIRES_MERCHANT_ACTION = "requires_merchant_action"
    REQUIRES_PAYMENT_METHOD = "requires_payment_method"
    REQUIRES_CONFIRMATION = "requires_confirmation"
    REQUIRES_CAPTURE = "requires_capture"
    PARTIALLY_CAPTURED = "partially_captured"
    PARTIALLY_CAPTURED_AND_CAPTURABLE = "partially_captured_and_capturable"
