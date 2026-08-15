from app.database import jobs_collection
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException


def create_job(job_dict):

    result = jobs_collection.insert_one(job_dict)

    job_dict["_id"] = str(result.inserted_id)

    return job_dict


def get_all_jobs():

    jobs = []

    for job in jobs_collection.find():

        job["_id"] = str(job["_id"])

        jobs.append(job)

    return jobs

def get_job_by_title(title):

    job = jobs_collection.find_one(
        {
            "title": title
        }
    )

    if job:
        job["_id"] = str(job["_id"])

    return job

def update_job(job_id, updated_data):

    try:
        object_id = ObjectId(job_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid Job ID"
        )

    result = jobs_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": updated_data
        }
    )

    return result.matched_count


def delete_job(job_id):

    try:
        object_id = ObjectId(job_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid Job ID"
        )

    result = jobs_collection.delete_one(
        {
            "_id": object_id
        }
    )

    return result.deleted_count

def get_job_by_id(job_id):

    try:
        object_id = ObjectId(job_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid Job ID"
        )

    job = jobs_collection.find_one(
        {
            "_id": object_id
        }
    )

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    job["_id"] = str(job["_id"])

    return job