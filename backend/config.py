import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    SECURITY_PASSWORD_SALT: str = os.getenv("SECURITY_PASSWORD_SALT", "your-password-salt")
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.hostinger.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", 587))
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "your-email@example.com")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "your-email-password")
    MAIL_USE_TLS: bool = os.getenv("MAIL_USE_TLS", "True").lower() == "true"
    ACCESS_TOKEN_EXPIRE_MINUTES: int= os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
    ALGORITHM: str='HS256'
    
settings = Settings()