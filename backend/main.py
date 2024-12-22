from database import engine
from models import Base
import re
from typing import Optional
from itsdangerous import URLSafeTimedSerializer

Base.metadata.create_all(bind=engine)

from database import SessionLocal
from models import User
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, status 
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from fastapi.responses import RedirectResponse
from schemas import UserCreate, UserResponse, LoginResponse, TokenData
from email_validator import validate_email, EmailNotValidError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from config import settings

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
async def register(user: UserCreate, db: Session = Depends(get_db)):
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
    db_user=User(email=user.email,username=user.username,hashed_password=pwd_context.hash(user.password),is_verified=False)
    db.add(db_user)
    db.flush()

    try :
        token = generate_verification_token(user.email)
        await send_verification_email(user.email, token)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()

        import logging
        logging.error(f"Error during user registration: {str(e)}")
        # Ensure the user object is removed from the session
        db.expunge(db_user)
        raise HTTPException(status_code=400,detail="Error occurred while registering user")

@app.get("/verify/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        return {"message": "Account already verified."}
    
    user.is_verified = True
    db.commit()
    return RedirectResponse(url="/login", status_code=303)

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
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl="/login/")),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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
    pattern = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$"
    return bool(re.match(pattern, password))

serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

def generate_verification_token(email):
    return serializer.dumps(email, salt=settings.SECURITY_PASSWORD_SALT)

def verify_token(token: str, expiration: int = 3600):
    try:
        email = serializer.loads(token, salt=settings.SECURITY_PASSWORD_SALT, max_age=expiration)
        return email
    except Exception:
        return None

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_USERNAME,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_USE_TLS,
    MAIL_SSL_TLS=False,  
    USE_CREDENTIALS=True
)

async def send_verification_email(email: str, token: str):
    verification_link = f"http://kayparmar.com/verify/{token}"
    message = MessageSchema(
        subject="Verify Your Email",
        recipients=[email],
        body=f"Click on the link to verify your email: {verification_link}",
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)