from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User

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
