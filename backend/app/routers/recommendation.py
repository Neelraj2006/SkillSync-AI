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