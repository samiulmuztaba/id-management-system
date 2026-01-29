from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, Base
import models
import schemas

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


    

