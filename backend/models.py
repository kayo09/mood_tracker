from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base 
from datetime import datetime

# Association table for many-to-many relationship between JournalEntry and Emotions
journal_emotion_association=Table(
    "journal_emotion_association",
    Base.metadata,
    Column("journal_entry_id", Integer, ForeignKey("journal_entries.id"), primary_key=True), Column("emotion_id", Integer, ForeignKey("emotions.id"), primary_key=True), 
)
