from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

import os
import shutil

from app.utils.auth import verify_token

from app.services.resume_parser import (
    extract_text_from_pdf,
    analyze_resume
)

from app.services.job_service import (
    get_job_by_title
)

from app.ai.skill_matcher import (
    calculate_skill_match
)

from app.database import users_collection


router = APIRouter(
    prefix="/resume",
    tags=["Resume AI"]
)


UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_title: str = "",
    token_data=Depends(verify_token)
):

    # -------------------------
    # PDF VALIDATION
    # -------------------------

    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )


    # -------------------------
    # JOB VALIDATION
    # -------------------------

    if not job_title.strip():

        raise HTTPException(
            status_code=400,
            detail="Job title is required"
        )


    job = get_job_by_title(
        job_title
    )


    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Selected job not found"
        )


    # -------------------------
    # SAVE FILE
    # -------------------------

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # -------------------------
    # EXTRACT TEXT
    # -------------------------

    extracted_text = extract_text_from_pdf(
        file_path
    )


    if not extracted_text.strip():

        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF contains no readable text"
        )


    # -------------------------
    # AI ANALYSIS
    # -------------------------

    try:

        analyzed_resume = analyze_resume(
            extracted_text
        )

    except Exception as error:

        print(
            "Resume AI analysis error:",
            error
        )

        raise HTTPException(
            status_code=503,
            detail="Resume AI analysis service is currently unavailable"
        )


    # -------------------------
    # SKILL MATCHING
    # -------------------------

    user_skills = analyzed_resume.get(
        "skills",
        []
    )

    job_skills = job.get(
        "skills",
        []
    )


    skill_match = calculate_skill_match(
        user_skills,
        job_skills
    )


    # -------------------------
    # SAVE USER PROFILE
    # -------------------------

    users_collection.update_one(

        {
            "email": token_data["email"]
        },

        {
            "$set": {
                "skills": user_skills,
                "resume": file.filename
            }
        }
    )


    # -------------------------
    # RESPONSE
    # -------------------------

    return {

        "filename": file.filename,

        "resume_analysis": analyzed_resume,

        "job": {

            "job_id": str(
                job["_id"]
            ),

            "title": job["title"],

            "company": job["company"],

            "required_skills": job_skills

        },

        "skill_match": skill_match

    }