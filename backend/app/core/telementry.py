#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: telementry.py
Author: Maria Kevin
Created: 2025-11-22
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"


import logfire


def init_telemetry(app, engine=None):
    logfire.configure()
    logfire.instrument_fastapi(app, capture_headers=True)
    logfire.instrument_system_metrics()
    logfire.instrument_sqlalchemy(engine=engine, enable_commenter=True)
