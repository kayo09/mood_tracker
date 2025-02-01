{POC FOR SENTIMENT ANALYSIS}
import main 
import asyncio
from database import SessionLocal
user=asyncio.run(main.get_current_user("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwYXJtYXIua2F5QGljbG91ZC5jb20iLCJleHAiOjE3MzgzNjYwMTF9.HpiiyqRunBMa17E3p9t2cG8-m0Lfic461P2ox2mVSZo",SessionLocal()))
print(user.id)

entries=main.get_journal_entries(SessionLocal(),user)
print(entries[0].emotion.split('>'))