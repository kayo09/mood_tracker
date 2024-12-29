import re
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt, JWTError
from itsdangerous import URLSafeTimedSerializer
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import Depends
from config import settings
import smtplib

# Token serializer
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

# Password validation
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

# Token generation for JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JSON Web Token for user authentication.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Generate email verification token
def generate_verification_token(email: str) -> str:
    """
    Generate a token for email verification.
    """
    return serializer.dumps(email, salt=settings.SECURITY_PASSWORD_SALT)

# Verify email token
def verify_token(token: str, expiration: int = 3600) -> Optional[str]:
    """
    Verify the email token and return the email if valid.
    """
    try:
        email = serializer.loads(token, salt=settings.SECURITY_PASSWORD_SALT, max_age=expiration)
        return email
    except Exception:
        return None

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_USERNAME,
    MAIL_PORT=587,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_USE_TLS,
    MAIL_SSL_TLS=False,  
    USE_CREDENTIALS=True,
)

# Send verification email
async def send_verification_email(email: str, token: str):
    """
    Send a verification email to the user.
    """
    verification_link = f"http://kayparmar.com/verify/{token}"
    message = MessageSchema(
        subject="Verify Your Email",
        recipients=[email],
        body=f"""
        <p>Thank you for registering!</p>
        <p>Click the link below to verify your email:</p>
        <a href="{verification_link}">{verification_link}</a>
        """,
        subtype="html"
    )
    try: 
        fm = FastMail(conf)
        await fm.send_message(message)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

from fastapi import HTTPException, status
from jose import JWTError, jwt

def decode_access_token(token: str):
    """
    Decode and validate the access token.
    """
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
        return email
    except JWTError:
        raise credentials_exception
