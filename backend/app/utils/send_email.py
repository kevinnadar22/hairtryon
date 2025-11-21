#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: send_email.py
Author: Maria Kevin
Created: 2025-11-18
Description: Utility functions for sending emails.
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from pathlib import Path

from core.config import settings
from fastapi import FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr, SecretStr

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=SecretStr(settings.MAIL_PASSWORD),
    MAIL_FROM=settings.MAIL_USERNAME,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path("app/templates"),
)

app = FastAPI()


async def send_mail_async(
    subject: str, email: EmailStr, body: dict, template_name: str
) -> bool:
    message = MessageSchema(
        subject=subject,
        recipients=[email],  # type: ignore
        template_body=body, 
        subtype=MessageType.html,
        from_name=settings.MAIL_FROM,
    )

    fm = FastMail(conf)
    await fm.send_message(message, template_name=template_name)
    return True
