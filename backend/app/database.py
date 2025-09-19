import os
from collections.abc import Iterator
from contextlib import contextmanager
import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./app.db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


@contextmanager
def get_session() -> Iterator[Session]:
    """Handle database operations safely (save all changes or cancel all changes)."""
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception as e:
        logger.error(f"Database session commit failed: {e}")
        session.rollback()
        raise
    finally:
        session.close()


def initialize_database():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
