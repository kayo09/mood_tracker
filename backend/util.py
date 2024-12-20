import bcrypt
def hash_password(password: str) -> str:
    # Generate a bcrypt hash
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify that the plain password matches the hashed password
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
