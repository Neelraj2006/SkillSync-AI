from fastapi import APIRouter, UploadFile, File, Depends, Query
import os
import shutil

from app.utils.auth import verify_token
from app.services.resume_parser import extract_text_from_pdf, analyze_resume
from app.ai.skill_matcher import calculate_skill_match
from app.services.job_service import get_job_by_title
from app.database import users_collection


router = APIRouter(
    prefix="/resume",
    tags=["Resume AI"]
)


UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_title: str = Query(...),
    token_data=Depends(verify_token)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)

    analyzed_resume = analyze_resume(extracted_text)

    users_collection.update_one(
        {
            "email": token_data["email"]
        },
        {
            "$set": {
                "skills": analyzed_resume["skills"],
                "resume": file.filename
            }
        }
    )

    job = get_job_by_title(job_title)

    if job is None:
        return {
            "error": "Job not found"
        }

    job_skills = job["skills"]

    match_result = calculate_skill_match(
        analyzed_resume["skills"],
        job_skills
    )

    return {
        "filename": file.filename,
        "resume_analysis": analyzed_resume,
        "job": job,
        "skill_match": match_result
    }