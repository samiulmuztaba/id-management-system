from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, Base, engine
import models
import schemas
from dotenv import load_dotenv
import os

load_dotenv()

models.Base.metadata.create_all(bind=engine)

# Seed admin user on startup
def create_admin_user():
    db = SessionLocal()
    
    # Check if admin already exists
    admin_exists = db.query(models.User).filter(models.User.is_admin == True).first()
    
    if not admin_exists:
        admin_password = os.getenv("ADMIN_PASSWORD", "admin")
        admin_user = models.User(
            username="admin",
            password=admin_password,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print(f"Admin user created: username='admin'")
    else:
        # If admin exists but password doesn't match env, update it so admin can log in with configured password
        admin_password = os.getenv("ADMIN_PASSWORD", "admin")
        if getattr(admin_exists, "password", None) != admin_password:
            admin_exists.password = admin_password
            db.add(admin_exists)
            db.commit()
            print("Admin user password updated from ADMIN_PASSWORD env")
        else:
            print("Admin user already exists and password matches")
    
    db.close()

create_admin_user()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # -> React runs on this port, soooo
    allow_credentials=True,
    allow_methods=["*"],  # -> Allow all methods (GET, POST, etc.)
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/login")
def login(request: schemas.LoginRequest):
    db = SessionLocal()
    
    user = db.query(models.User).filter(models.User.username == request.username).first()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if user.password != request.password:
        db.close()
        raise HTTPException(status_code=401, detail="Invalid password")

    resp = schemas.UserResponse(
        user_id=user.id,
        success=True,
        username=user.username,
        is_admin=user.is_admin
    )
    db.close()
    return resp

@app.post("/register")
def register(request: schemas.RegistrationRequest):
    db = SessionLocal()
    
    existing_user = db.query(models.User).filter(models.User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = models.User(
        username=request.username,
        password=request.password,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return schemas.UserResponse(
        user_id=new_user.id,
        success=True,
        username=new_user.username,
        is_admin=new_user.is_admin
    )

@app.get('/users')
def get_all_users():
    db = SessionLocal()
    
    users = db.query(models.User).all()
    
    response = []
    for user in users:
        response.append(schemas.UserResponse(
            user_id=user.id,
            success=True,
            username=user.username,
            is_admin=user.is_admin
        ))
    
    return response

@app.get('/user/{user_id}')
def get_user(user_id: str):
    db = SessionLocal()
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return schemas.UserResponse(
        user_id=user.id,
        success=True,
        username=user.username,
        is_admin=user.is_admin
    )

@app.post("/submit_form")
def submit_form(request: schemas.FormSubmission):
    db = SessionLocal()
    
    new_application = models.Application(
        user_id=request.user_id,
        form_data=request.form_data,
        approval_status="pending"
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return schemas.ApplicationResponse(
        application_id=new_application.application_id,
        user_id=new_application.user_id,
        form_data=new_application.form_data,
        approval_status=new_application.approval_status
    )


@app.get('/pending_applications/{user_id}')
def get_pending_applications(user_id: str):
    db = SessionLocal()
    
    # Verify that the requesting user is an admin
    admin_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not admin_user or not admin_user.is_admin:
        raise HTTPException(status_code=403, detail="Unauthorized: Admin access required")
    
    applications = db.query(models.Application).filter(models.Application.approval_status == "pending").all()
    
    response = []
    for app in applications:
        response.append(schemas.ApplicationResponse(
            application_id=app.application_id,
            user_id=app.user_id,
            form_data=app.form_data,
            approval_status=app.approval_status
        ))
    
    return response

@app.post("/approve_application/{application_id}/{user_id}")
def approve_application(application_id: str, user_id: str):
    db = SessionLocal()
    
    # Verify that the requesting user is an admin
    admin_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not admin_user or not admin_user.is_admin:
        raise HTTPException(status_code=403, detail="Unauthorized: Admin access required")
    
    application = db.query(models.Application).filter(models.Application.application_id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.approval_status = "approved"
    db.commit()
    db.refresh(application)
    
    return schemas.ApplicationResponse(
        application_id=application.application_id,
        user_id=application.user_id,
        form_data=application.form_data,
        approval_status=application.approval_status
    )

@app.get("/my_applications/{user_id}")
def get_my_applications(user_id: str):
    db = SessionLocal()
    
    application = db.query(models.Application).filter(models.Application.user_id == user_id).first()
    
    if application:
        return schemas.MyApplicationsResponse(
            has_applications=True,
            status=application.approval_status,
            form_data=application.form_data
        )
    else:
        return schemas.MyApplicationsResponse(
            has_applications=False
        )

@app.delete('/delete/{user_id}/{target_user_id}')
def delete_user(user_id: str, target_user_id: str):
    db = SessionLocal()
    
    # Verify that the requesting user is an admin
    admin_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not admin_user or not admin_user.is_admin:
        raise HTTPException(status_code=403, detail="Unauthorized: Admin access required")
    
    user = db.query(models.User).filter(models.User.id == target_user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    
    return {"detail": "User deleted successfully"}