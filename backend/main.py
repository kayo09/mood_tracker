from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import UserCreate, UserResponse, LoginResponse
from crud import create_user, get_user_by_email, verify_password, verify_user_email
from utils import create_access_token, validate_password, send_verification_email, generate_verification_token, verify_token

app = FastAPI()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if not validate_password(user.password):
        raise HTTPException(status_code=400, detail="Password is too weak")
    
    db_user = create_user(db, user.email, user.username, user.password)
    try:
        token = generate_verification_token(user.email)
        await send_verification_email(user.email, token)
        db.commit()
        return db_user
    except Exception as e:
        db.rollback()
        db.expunge(db_user)
        raise HTTPException(status_code=400, detail="Error occurred while registering user")

@app.get("/verify/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = verify_user_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Email verified successfully"}

@app.post("/login/", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}