from app.database import users_collection
from app.utils.security import hash_password

def create_user(user_dict):

    if email_exists(user_dict["email"]):
        return None

    user_dict["password"] = hash_password(
        user_dict["password"]
    )

    result = users_collection.insert_one(user_dict)

    user_dict["_id"] = str(result.inserted_id)

    return user_dict

def get_user_by_email(email: str):

    user = users_collection.find_one(
        {
            "email": email
        }
    )

    if user:
        user["_id"] = str(user["_id"])

    return user

def email_exists(email: str):

    user = users_collection.find_one(
        {
            "email": email
        }
    )

    return user is not None