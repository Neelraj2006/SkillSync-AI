from app.database import jobs_collection


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