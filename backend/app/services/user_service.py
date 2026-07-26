from app.database import users_collection

def create_user(user_dict):

    result = users_collection.insert_one(user_dict)

    user_dict["_id"] = str(result.inserted_id)

    return user_dict