from fastapi import APIRouter
from app.schemas.user import UserRegister
from app.services.user_service import create_user
from app.utils.response import success_response
from app.schemas.user import UserLogin
from app.services.user_service import get_user_by_email
from app.services.user_service import update_user_name
from app.utils.security import verify_password
from app.utils.response import success_response, error_response
from app.utils.jwt_handler import create_access_token
from app.utils.auth import verify_token
from fastapi import Depends
from app.schemas.user import UserUpdate
from app.services.user_service import delete_user


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

@router.get("/me")
def get_current_user(
    token_data=Depends(verify_token)
):

    email = token_data["email"]

    user = get_user_by_email(email)

    if user is None:

        return error_response(
            "User Not Found"
        )

    return success_response(
        "User Found",
        user
    )

@router.put("/me")
def update_current_user(
    user_update: UserUpdate,
    token_data=Depends(verify_token)
):

    email = token_data["email"]

    updated = update_user_name(
        email,
        user_update.name
    )

    if updated == 0:

        return error_response(
            "User Not Updated"
        )

    return success_response(
        "User Updated Successfully"
    )

@router.delete("/me")
def delete_current_user(
    token_data=Depends(verify_token)
):

    email = token_data["email"]

    deleted = delete_user(email)

    if deleted == 0:

        return error_response(
            "User Not Found"
        )

    return success_response(
        "User Deleted Successfully"
    )