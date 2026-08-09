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

def get_job_by_title(title):

    job = jobs_collection.find_one(
        {
            "title": title
        }
    )

    if job:
        job["_id"] = str(job["_id"])

    return job

def update_job(title, updated_data):

    result = jobs_collection.update_one(
        {
            "title": title
        },
        {
            "$set": updated_data
        }
    )

    return result.modified_count


def delete_job(title):

    result = jobs_collection.delete_one(
        {
            "title": title
        }
    )

    return result.deleted_count

