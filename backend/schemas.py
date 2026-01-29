from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class RegistrationRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: str
    success: bool
    username: str
    is_admin: bool

class FormSubmission(BaseModel):
    user_id: str
    form_data: dict

class ApplicationResponse(BaseModel):
    application_id: str
    user_id: str
    form_data: dict
    approval_status: str

class MyApplicationsResponse(BaseModel):
    has_applications: bool
    status: Optional[str] = None  # e.g., "pending", "approved", "rejected" and if has_applications is False, status can be None
    form_data: Optional[dict] = None # The form data if an application exists OR None