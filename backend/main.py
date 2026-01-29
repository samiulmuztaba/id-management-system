from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, Base, engine
import models
import schemas

models.Base.metadata.create_all(bind=engine)

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

    if user and user.password == request.password:
        return schemas.UserResponse(
            user_id=user.id,
            success=True,
            username=user.username,
            is_admin=user.is_admin
        )
    raise HTTPException(status_code=401, detail="Invalid username or password")

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


@app.get('/pending_applications')
def get_pending_applications():
    db = SessionLocal()
    
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

@app.post("/approve_application/{application_id}")
def approve_application(application_id: int):
    db = SessionLocal()
    
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