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

    except Exception:

        raise HTTPException(
            status_code=503,
            detail="Resume AI analysis service is currently unavailable"
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
                "skills": analyzed_resume["skills"],
                "resume": file.filename
            }
        }
    )


    # -------------------------
    # RESPONSE
    # -------------------------

    return {
        "filename": file.filename,
        "resume_analysis": analyzed_resume
    }