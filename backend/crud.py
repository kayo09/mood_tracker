from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, JournalEntry
import datetime

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

def create_journal_entry(db: Session, user_id: int, date_time: datetime.datetime, emotion: str, notes: str):
    db_entry = JournalEntry(user_id=user_id, emotion=emotion, notes=notes)
    db.add(db_entry)
    db.flush()
    return db_entry