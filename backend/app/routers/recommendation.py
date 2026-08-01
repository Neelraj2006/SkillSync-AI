from fastapi import APIRouter, Depends

from app.utils.auth import verify_token

from app.services.recommendation_service import recommend_jobs

from app.utils.response import success_response

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/")
def get_recommendations(
    token_data=Depends(verify_token)
):

    email = token_data["email"]

    jobs = recommend_jobs(email)

    return success_response(
        "Recommendations Retrieved",
        jobs
    )

from app.database import users_collection
from app.database import jobs_collection

from app.ai.skill_matcher import calculate_skill_match


def recommend_jobs(email):

    # Find logged-in user
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

        job_skills = job.get("required_skills", [])

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