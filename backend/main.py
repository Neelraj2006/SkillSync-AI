from app.database import db
from fastapi import FastAPI
from app.routers.student import router as student_router
from app.routers.user import router as user_router
from app.routers.job import router as job_router
from app.routers.recommendation import router as recommendation_router

app = FastAPI(
    title="SkillSync AI API",
    version="1.0.0",
)

@app.get("/")
def home():
    return {
        "message": "Welcome to SkillSync AI 🚀"
    }

@app.get("/about")
def about():
    return {
        "project": "SkillSync AI",
    }

@app.get("/health")
def health():
    return {
        "status": "Running Successfully"
    }

app.include_router(student_router)
app.include_router(user_router)
app.include_router(job_router)
app.include_router(
    recommendation_router
)

@app.get("/")
def home():

    return {

        "project": "SkillSync AI",

        "status": "Running",

        "version": "1.0"

    }

@app.get("/health")
def health():

    return {

        "database":"Connected",

        "server":"Healthy"

    }