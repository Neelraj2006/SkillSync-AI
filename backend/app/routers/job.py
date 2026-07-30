from fastapi import APIRouter

from app.schemas.job import Job

from app.services.job_service import (
    create_job,
    get_all_jobs
)

from app.utils.response import success_response

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.post("/")
def add_job(job: Job):

    created = create_job(
        job.model_dump()
    )

    return success_response(
        "Job Created Successfully",
        created
    )

@router.get("/")
def view_jobs():

    jobs = get_all_jobs()

    return success_response(
        "Jobs Retrieved Successfully",
        jobs
    )