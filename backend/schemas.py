# from pydantic import BaseModel, EmailStr
# from datetime import datetime
# from typing import Optional

# class UserCreate(BaseModel):
#     username:str
#     email:EmailStr
#     password:str

# class UserResponse(BaseModel):
#     id:int
#     username:str
#     email:EmailStr
#     created_at:datetime
#     updated_at:datetime

#     class Config:
#         orm_mode=True

# class JournalEntryCreate(BaseModel):
#     mood: str
#     text: str
#     date_time: Optional[datetime]= None

# class JournalEntryResponse(JournalEntryCreate):
#     id: int
#     user_id:int

#     class Config:
#         orm_mode= True

# class LoginRequest(BaseModel):
#     email:str
#     password:str
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