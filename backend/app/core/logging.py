#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: logging.py
Author: Maria Kevin
Created: 2025-11-21
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


import sys

from loguru import logger


def setup_logging():
    """Set up logging configuration."""
    logger.add("app.log", rotation="10 MB", retention="10 days", level="INFO")
    logger.add("error.log", rotation="10 MB", retention="30 days", level="ERROR")

    logger.add(
        sys.stderr,
        format="<green>{time}</green> <level>{message}</level>",
    )

    logger.info("Logging is set up.")
