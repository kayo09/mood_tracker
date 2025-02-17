from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, JournalEntry
from datetime import datetime, timezone
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create a new user
def create_user(db: Session, email: str, username: str, password: str):
    hashed_password = pwd_context.hash(password)
    db_user = User(email=email, username=username, hashed_password=hashed_password, is_verified=False)
    db.add(db_user)
    db.flush()
    return db_user

# Fetch user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Verify user password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Mark user as verified
def verify_user_email(db: Session, email: str):
    user = get_user_by_email(db, email)
    if user:
        user.is_verified = True
        db.commit()
        return user
    return None


def create_journal_entry(db: Session, user_id: int, date_time, emotion: str, notes: str):
    try:
        # Ensure date_time is a string before checking `.endswith()`
        if isinstance(date_time, str) and date_time.endswith('Z'):
            date_time = date_time[:-1] + '+00:00'
        
        # Convert string to datetime, if necessary
        if isinstance(date_time, str):
            dt = datetime.fromisoformat(date_time).astimezone(timezone.utc)
        elif isinstance(date_time, datetime):
            dt = date_time.astimezone(timezone.utc)
        else:
            raise HTTPException(status_code=400, detail="Invalid date format: Must be ISO 8601 string or datetime object")

        db_entry = JournalEntry(
            user_id=user_id,
            emotion=emotion,
            notes=notes,
            date_time=dt
        )
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")