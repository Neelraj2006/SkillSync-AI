from fastapi import APIRouter

from app.schemas.job import Job

from app.services.job_service import (
    create_job,
    get_all_jobs,
    get_job_by_id,
    update_job,
    delete_job
)

from app.utils.response import success_response

from fastapi import HTTPException


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

@router.get("/{job_id}")
def view_job(
    job_id: str
):

    job = get_job_by_id(
        job_id
    )

    return success_response(
        "Job Retrieved Successfully",
        job
    )

@router.put("/{job_id}")
def edit_job(job_id: str, job: Job):

    updated = update_job(
        job_id,
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


@router.delete("/{job_id}")
def remove_job(job_id: str):

    deleted = delete_job(job_id)

    if deleted == 0:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return success_response(
        "Job Deleted Successfully",
        None
    )