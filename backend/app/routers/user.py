from fastapi import APIRouter
from app.schemas.user import UserRegister
from app.services.user_service import create_user
from app.utils.response import success_response
from app.schemas.user import UserLogin
from app.services.user_service import get_user_by_email
from app.utils.security import verify_password
from app.utils.response import success_response, error_response
from app.utils.jwt_handler import create_access_token

router = APIRouter()

@router.post("/register")
def register_user(user: UserRegister):

    user_dict = user.model_dump()

    created_user = create_user(user_dict)

    if created_user is None:

        return error_response(
            message="Email already registered"
        )

    return success_response(
        message="User Registered Successfully",
        data=created_user
    )

@router.post("/login")
def login_user(user: UserLogin):

    db_user = get_user_by_email(user.email)

    if db_user is None:
        return error_response("User Not Found")

    if not verify_password(user.password, db_user["password"]):
        return error_response("Invalid Password")

    token = create_access_token(
        {
            "email": db_user["email"]
        }
    )

    return success_response(
        message="Login Successful",
        data={
            "access_token": token,
            "token_type": "bearer"
        }
    )