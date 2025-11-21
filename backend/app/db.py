"""
Database configuration and session management.

This module sets up SQLAlchemy engine, session factory, and base class
for ORM models, along with database dependency injection.
"""

from core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import Session  # do not remove, imported in other modules
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine(
    settings.DATABASE_URL,  connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


__all__ = ["Session", "get_db", "Base", "engine"]
