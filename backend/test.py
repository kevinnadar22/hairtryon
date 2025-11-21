#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: test.py
Author: Maria Kevin
Created: 2025-11-21
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"

import sys
from loguru import logger

logger.add(
    sys.stderr,
    format="<green>{time}</green> <level>{message}</level>",
)
logger.warning("test")
