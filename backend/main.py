from database import engine
from models import Base

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

app= FastAPI()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/add_entry/",response_model=schemas.JournalEntryResponse)
def add_entry(entry: schemas.JournalEntryCreate, db: Session= Depends(get_db)):
    return crud.create_journal_entry(db=db, entry=entry)

@app.post("/entries/",response_model=list[schemas.JournalEntryResponse])
def get_entries(db: Session=Depends(get_db)):
    return crud.get_all_entries(db=db)
