from fastapi import FastAPI

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