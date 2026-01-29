from database import Base
from sqlalchemy import Column, String, Boolean, JSON
import uuid

class User(Base):
    """For user data model definition. It should have a id, username, password, and is_admin flag. """
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

class Application(Base):
    """For application data model definition. It should have application_id, user_id, form_data (as JSON), and approval_status."""
    __tablename__ = "applications"

    application_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    form_data = Column(JSON, nullable=False)
    approval_status = Column(String, default="pending")

# Hi, samiul, it's me from the past. It's all written by me. __tablename__ is just kind of a label to the table, then we add columns with their types and constraints.