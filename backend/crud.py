# TO-DO: Add proper PEP8 doc
from sqlalchemy.orm import Session
from models import JournalEntry
from schemas import JournalEntryCreate,UserCreate
import schemas
from util import hash_password
from datetime import datetime
import models 

def create_user(db:Session, user: UserCreate):
    hashed_password=hash_password(user.password)
    db_user=models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_journal_entry(db: Session, entry: schemas.JournalEntryCreate, user_id: int):
    db_entry = models.JournalEntry(
        emotion=entry.emotion,
        text=entry.text,
        date_time=entry.date_time or datetime.utcnow(),
        user_id=user_id  # Link the entry to the current user
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_all_entries(db: Session):
    return db.query(JournalEntry).all()

def get_user_by_email(db:Session, email:str)-> models.User| None:
    return db.query(models.User).filter(models.User.email==email).first()

def get_entries_by_user(db: Session, user_id: int):
    """
    Get all journal entries for a specific user.
    
    Args:
        db (Session): Database session.
        user_id (int): The ID of the user whose entries we want to retrieve.
        
    Returns:
        List[JournalEntry]: A list of journal entries for the user.
    """
    return db.query(JournalEntry).filter(JournalEntry.user_id == user_id).all()

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user_id(db: Session, token: str = Depends(oauth2_scheme)):
    """
    Get the current user's ID from the provided OAuth2 token.
    This is a placeholder; adjust it based on your authentication mechanism.

    Args:
        token (str): The OAuth2 token provided by the user.

    Returns:
        int: The user ID associated with the token.
    """
    user_id = JournalEntry.user.id  # This is a placeholder function
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id