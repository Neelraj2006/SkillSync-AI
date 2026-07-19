from fastapi import FastAPI
from app.routers.student import router as student_router

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