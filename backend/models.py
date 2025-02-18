from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base 
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=False, index=True, nullable=False)  # Added length (100)
    email = Column(String(255), unique=True, index=True, nullable=False)  # Added length (255)
    hashed_password = Column(String(255), nullable=False)  # Added length (255)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_verified = Column(Boolean, default=False)

    journal_entries = relationship("JournalEntry", back_populates="user")

class JournalEntry(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime, default=datetime.utcnow)
    emotion = Column(String(50), index=True)  # Added length (50)
    notes = Column(Text, index=True)  # Changed to `Text` since notes might be longer
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journal_entries")