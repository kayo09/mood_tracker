from sqlalchemy.orm import Session
from models import JournalEntry
from schemas import JournalEntryCreate


def create_journal_entry(db: Session, entry: JournalEntryCreate):
    db_entry=JournalEntry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_all_entries(db: Session):
    return db.query(JournalEntry).all()
