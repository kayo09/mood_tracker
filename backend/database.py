from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL=os.getenv("DATABASE_URL")

engine=create_engine(DATABASE_URL,connect_args={"check_same_thread":False})

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()

from models import JournalEntry, User

Base.metadata.create_all(bind=engine)