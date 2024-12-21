from database import engine
from models import Base
import re
from typing import Optional

Base.metadata.create_all(bind=engine)

from database import SessionLocal
from models import User
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from schemas import UserCreate, UserResponse, LoginResponse, TokenData
from email_validator import validate_email, EmailNotValidError
from passlib.context import CryptContext
import auth
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app= FastAPI()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate,db: Session=Depends(get_db)):
    try: 
        #Validate the email and password
        validate_email(user.email)
    except EmailNotValidError as e:
        raise HTTPException(status_code=400,detail="Invalid email")
    
    #Check if the user already exists
    if db.query(User).filter(User.email==user.email).first():
        raise HTTPException(status_code=400,detail="Email already registered")
    
    #validate the password
    if not validate_password(user.password):
        raise HTTPException(status_code=400,detail="Password is too weak")
    
    #create new user
    db_user=User(email=user.email,username=user.username,hashed_password=pwd_context.hash(user.password))

    try :
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        # db.rollback()
        raise HTTPException(status_code=400,detail=e)

@app.post("/login/", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
    #find user by email
    user=db.query(User).filter(User.email==form_data.username).first()
    if not user:
        raise HTTPException(status_code=400,detail="Incorrect email or password")
    #verify password
    if not pwd_context.verify(form_data.password,user.hashed_password):
        raise HTTPException(status_code=400,detail="Incorrect email or password")
    
    #generate access token
    access_token=create_access_token(data={"sub":user.email})
    return {"access_token":access_token,"token_type":"bearer", "user":user}

# Token generation function
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, auth.SECRET_KEY, algorithm=auth.ALGORITHM)
    return encoded_jwt

# Optional: Dependency to get current user from token
async def get_current_user(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl="login")),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
        
    return user

# Password validation helper
def validate_password(password: str) -> bool:
    """
    Validate password strength:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 8:
        return False
    
    patterns = [
        r"[A-Z]",  # uppercase
        r"[a-z]",  # lowercase
        r"[0-9]",  # numbers
        r"[!@#$%^&*(),.?\":{}|<>]"  # special characters
    ]
    
    return all(re.search(pattern, password) for pattern in patterns)