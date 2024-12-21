from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base 
from datetime import datetime

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    username=Column(String,unique=False,index=True,nullable=False)
    email=Column(String,unique=True,index=True,nullable=False)
    hashed_password=Column(String,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)
    # updated_at=Column(DateTime,default=datetime.utcnow)

    journal_entries=relationship("JournalEntry",back_populates="user")

class JournalEntry(Base):
    __tablename__="journal_entries"

    id=Column(Integer,primary_key=True,index=True)
    date_time=Column(DateTime,default=datetime.utcnow)
    emotion=Column(String,index=True)
    text=Column(Text)
    user_id=Column(Integer,ForeignKey("users.id"))

    user=relationship("User",back_populates="journal_entries")