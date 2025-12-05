#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: lifespan.py
Author: Maria Kevin
Created: 2025-12-01
Description: Brief description
"""

__author__ = "Maria Kevin"
__version__ = "0.1.0"

from contextlib import asynccontextmanager

from db import Base, engine
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # creates the database tables
    Base.metadata.create_all(bind=engine)
    yield
