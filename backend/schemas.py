from pydantic import BaseModel, EmailStr
import datetime
from typing import Optional 


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime.datetime

    class Config:
        orm_mode = True
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class JournalEntryResponse(BaseModel):
    id: int 
    emotion: str
    notes: str
    date_time: datetime.datetime
    created_at: datetime.datetime

    class Config: 
        orm_mode = True

class JournalEntryCreate(BaseModel):
    emotion: str
    notes: str
    date_time: Optional[datetime.datetime]= datetime.datetime.now()