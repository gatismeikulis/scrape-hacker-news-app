from sqlalchemy import Column, DateTime, Index, Integer, String, Text
from .database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(String(20), primary_key=True)  # Automatically unique, not-null and indexed
    title = Column(Text, nullable=False)
    link = Column(Text, nullable=False)
    points = Column(Integer, nullable=True)
    date_created = Column(DateTime, nullable=False)
    scraped_at = Column(DateTime, nullable=False)
