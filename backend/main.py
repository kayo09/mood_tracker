from database import engine
from models import Base

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas
from util import verify_password
from crud import get_current_user_id


app= FastAPI()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/add_entry/", response_model=schemas.JournalEntryResponse)
def add_entry(
    entry: schemas.JournalEntryCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)  # Assuming this dependency returns the logged-in user's ID
):
    return crud.create_journal_entry(db=db, entry=entry, user_id=user_id)

@app.post("/entries/", response_model=list[schemas.JournalEntryResponse])
def get_entries(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)  # Assuming the current user's ID
):
    return crud.get_entries_by_user(db=db, user_id=user_id)

@app.post("/login/")
def login(login_request: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user=crud.get_user_by_email(db, email=login_request.email)
    if not db_user or not verify_password(login_request.password, db_user.hashed_password):
        raise FastAPI.HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": db_user.id}

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new user in the database.
    """
    # Check if the email is already registered
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise FastAPI.HTTPException(status_code=400, detail="Email already registered")
    
    # Create the user
    return crud.create_user(db=db, user=user)