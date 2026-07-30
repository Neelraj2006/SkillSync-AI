from app.database import users_collection
from app.database import jobs_collection


def recommend_jobs(email: str):

    user = users_collection.find_one(
        {
            "email": email
        }
    )

    if not user:

        return []

    user_skills = set(
        user.get("skills", [])
    )

    recommendations = []

    for job in jobs_collection.find():

        job_skills = set(
            job.get("skills", [])
        )

        matched = user_skills.intersection(
            job_skills
        )

        if matched:

            job["_id"] = str(job["_id"])

            job["matched_skills"] = list(matched)

            job["match_count"] = len(matched)

            recommendations.append(job)

    recommendations.sort(
        key=lambda x: x["match_count"],
        reverse=True
    )

    return recommendations