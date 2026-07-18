from fastapi import FastAPI
from app.schemas.student import Student

app = FastAPI(
    title="SkillSync AI API",
    version="1.0.0",
    description="Backend API for SkillSync AI"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to SkillSync AI 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "Running Successfully"
    }

@app.get("/about")
def about():
    return {
        "project": "SkillSync AI",
        "version": "1.0.0"
    }

@app.get("/student/{student_id}")
def student(student_id: int):
    return {
        "student_id": student_id
    }

@app.get("/search")
def search(name: str):
    return {
        "Searching": name
    }

@app.post("/student")
def create_student(student: Student):
    return {
        "message":"Student Created Successfully",
        "data":student
    }