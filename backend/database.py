from sqlalchemy import create_engine, Column, Integer, String, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    "sqlite:///app.db", conect_args={"check_same_thread": False}
)  # -> This creates a database file named app.db and check_same_thread is set to False for SQLite to allow usage in multi-threaded applications.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # -> This is a factory for creating new Session objects.

Base = declarative_base() # -> This is the base class for all our ORM models.

