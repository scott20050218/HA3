from __future__ import annotations

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session


def _get_database_url() -> str:
    # Allow overriding via env var for testing
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    # Default to SQLite file in backend/ directory
    return "sqlite:///./database.db"


SQLALCHEMY_DATABASE_URL = _get_database_url()

# Globals initialized but can be reconfigured at runtime (important for tests)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
_tables_initialized: bool = False


def configure_database(url: str | None = None) -> None:
    """Reconfigure engine and session factory using a given or env database URL.

    Ensures tests can set DATABASE_URL before app startup.
    """
    global engine, SessionLocal, SQLALCHEMY_DATABASE_URL, _tables_initialized
    SQLALCHEMY_DATABASE_URL = url or _get_database_url()
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {},
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    # force re-initialization of tables on next session acquire
    _tables_initialized = False


def get_db() -> Generator[Session, None, None]:
    global _tables_initialized
    if not _tables_initialized:
        # Lazily ensure tables exist. Safe to call multiple times.
        Base.metadata.create_all(bind=engine)
        _tables_initialized = True
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


