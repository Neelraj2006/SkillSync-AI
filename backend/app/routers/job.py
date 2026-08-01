from fastapi import APIRouter

from app.schemas.job import Job

from app.services.job_service import (
    create_job,
    get_all_jobs
)

from app.utils.response import success_response

from fastapi import HTTPException

from app.services.job_service import (
    update_job,
    delete_job
)

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

@router.put("/{title}")
def edit_job(title: str, job: Job):

    updated = update_job(
        title,
        job.model_dump()
    )

    if updated == 0:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return success_response(
        "Job Updated Successfully",
        None
    )

@router.delete("/{title}")
def remove_job(title: str):

    deleted = delete_job(title)

    if deleted == 0:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return success_response(
        "Job Deleted Successfully",
        None
    )