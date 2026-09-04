from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
)

from app.utils.auth import verify_token
from app.services.resume_parser import (
    extract_text_from_pdf,
    analyze_resume,
)
from app.services.job_service import get_job_by_title
from app.ai.skill_matcher import calculate_skill_match
from app.database import users_collection


router = APIRouter(
    prefix="/resume",
    tags=["Resume AI"],
)


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_title: str = "",
    token_data=Depends(verify_token),
):
    # -----------------------------
    # VALIDATE FILE TYPE
    # -----------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume."
        )

    filename = file.filename.strip()

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    # -----------------------------
    # VALIDATE JOB
    # -----------------------------

    if not job_title.strip():
        raise HTTPException(
            status_code=400,
            detail="Please select a job."
        )

    job = get_job_by_title(job_title)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Selected job was not found."
        )

    # -----------------------------
    # READ PDF INTO MEMORY
    # -----------------------------

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty."
        )

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Resume file must be smaller than 10 MB."
        )

    # -----------------------------
    # EXTRACT TEXT
    # -----------------------------

    try:
        extracted_text = extract_text_from_pdf(
            file_bytes
        )

    except Exception as error:
        print(
            f"PDF extraction error: {error}"
        )

        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded PDF."
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text was found in the PDF."
        )

    # -----------------------------
    # AI RESUME ANALYSIS
    # -----------------------------

    try:
        analyzed_resume = analyze_resume(
            extracted_text
        )

    except Exception as error:
        print(
            f"Resume AI analysis error: {error}"
        )

        raise HTTPException(
            status_code=503,
            detail="Resume analysis service is currently unavailable."
        )

    # -----------------------------
    # SKILL MATCHING
    # -----------------------------

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

    # -----------------------------
    # UPDATE USER PROFILE
    # -----------------------------

    users_collection.update_one(
        {
            "email": token_data["email"]
        },
        {
            "$set": {
                "skills": user_skills,
                "resume": filename,
            }
        }
    )

    # -----------------------------
    # RESPONSE
    # -----------------------------

    return {
        "filename": filename,

        "resume_analysis": analyzed_resume,

        "job": {
            "job_id": str(job["_id"]),
            "title": job["title"],
            "company": job["company"],
            "required_skills": job_skills,
        },

        "skill_match": skill_match,
    }