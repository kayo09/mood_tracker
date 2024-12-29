from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from config import settings
import asyncio

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
    fm = FastMail(conf)
    try: 
        await fm.send_message(message)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

asyncio.run(send_verification_email("parmar.kay@icloud.com", "123456"))
