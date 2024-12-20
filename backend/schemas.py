from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JournalEntryCreate(BaseModel):
    mood: str
    text: str
    date_time: Optional[datetime]= None

class JournalEntryResponse(JournalEntryCreate):
    id: int

    class Config:
        orm_mode= True
