from app.database import users_collection
from app.database import jobs_collection

from app.ai.skill_matcher import calculate_skill_match


def recommend_jobs(email):

    user = users_collection.find_one(
        {
            "email": email
        }
    )

    if not user:
        return []

    user_skills = user.get("skills", [])

    jobs = list(jobs_collection.find())

    recommendations = []

    for job in jobs:

        job_skills = job.get("skills", [])

        result = calculate_skill_match(
            user_skills,
            job_skills
        )

        recommendations.append({

            "job_title": job["title"],

            "company": job["company"],

            "required_skills": job_skills,

            "match_percentage": result["match_percentage"],

            "matched_skills": result["matched_skills"],

            "missing_skills": result["missing_skills"],

            "recommendation": (
                "Highly Recommended"
                if result["match_percentage"] >= 80
                else "Recommended"
                if result["match_percentage"] >= 50
                else "Needs Skill Improvement"
            )

        })

    recommendations.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return recommendations