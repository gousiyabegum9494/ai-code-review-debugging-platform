from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from models.project import Project
from models.code_file import CodeFile

from routers.projects import router as project_router
from routers.code_files import router as code_router
from routers.review import router as review_router

# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="AI Code Review & Debugging Platform",
    description="Module 1 - Code Input & Project Management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routers
app.include_router(project_router)
app.include_router(code_router)
app.include_router(review_router)


# Home API
@app.get("/")
def home():
    return {
        "message": "AI Code Review Platform is running",
        "module": "Module 1 - Code Input & Project Management"
    }


# Health check API
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }