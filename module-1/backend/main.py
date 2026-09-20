from fastapi import FastAPI

from database.db import Base, engine
from models.project import Project
from models.code_file import CodeFile

from routers.projects import router as project_router
from routers.code_files import router as code_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="AI Code Review & Debugging Platform",
    description="Module 1 - Code Input & Project Management",
    version="1.0.0"
)


# Register routers
app.include_router(project_router)
app.include_router(code_router)


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)