#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: mail_service.py
Author: Maria Kevin
Created: 2025-11-18
Description: Mail service utilities.
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"

from pydantic import EmailStr
from utils import send_mail_async


class MailService:
    """Service for sending emails."""

    async def send_password_reset_email(self, email: EmailStr, reset_link: str) -> bool:
        """Send a password reset email."""
        subject = "Password Reset Request"
        template_name = "reset_password.html"
        body = {"reset_link": reset_link}
        return await send_mail_async(subject, email, body, template_name)

    async def send_signup_verification_email(
        self, email: EmailStr, name: str, verification_code: str
    ) -> bool:
        """Send a signup verification email."""
        subject = "Verify Your Email Address"
        template_name = "verify_signup.html"
        body = {"name": name, "verification_code": verification_code}
        return await send_mail_async(subject, email, body, template_name)

    async def send_login_otp_email(
        self, email: EmailStr, name: str, verification_code: str
    ) -> bool:
        """Send a login OTP email."""
        subject = "Your Login OTP Code"
        template_name = "verify_login.html"
        body = {"name": name, "verification_code": verification_code}
        return await send_mail_async(subject, email, body, template_name)
