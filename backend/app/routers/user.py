from fastapi import APIRouter
from app.schemas.user import UserRegister
from app.services.user_service import create_user
from app.utils.response import success_response

router = APIRouter()

@router.post("/register")
def register_user(user: UserRegister):

    user_dict = user.model_dump()

    created_user = create_user(user_dict)

    return success_response(
        message="User Registered Successfully",
        data=created_user
    )