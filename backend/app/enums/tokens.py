#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: tokens.py
Author: Maria Kevin
Created: 2025-11-18
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


from enum import Enum


class TokenType(Enum):
    ACCESS = "access"
    PASSWORD_RESET = "reset"
    SIGNUP_VERIFY = "signup_verify"
    LOGIN_VERIFY = "login_verify"
    REFRESH = "refresh"