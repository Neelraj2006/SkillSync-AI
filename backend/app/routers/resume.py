from fastapi import APIRouter, UploadFile, File, Depends
import os
import shutil

from app.utils.auth import verify_token
from app.ai.resume_parser import extract_text_from_pdf
from app.ai.resume_parser import analyze_resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume AI"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_resume(

    file: UploadFile = File(...),

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

    return {

        "filename": file.filename,

        "text": analyzed_resume

    }