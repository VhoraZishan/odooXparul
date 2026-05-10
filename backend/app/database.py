from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
DBNAME = os.getenv("DB_NAME")

import urllib.parse

# URL-encode the password to safely handle special characters like @
encoded_password = urllib.parse.quote_plus(PASSWORD) if PASSWORD else ""

DATABASE_URL = (
    f"postgresql+psycopg2://"
    f"{USER}:{encoded_password}@{HOST}:{PORT}/{DBNAME}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()