from app.database import students_collection

from fastapi import HTTPException

from bson import ObjectId
from bson.errors import InvalidId


def create_student(student_dict):

    result = students_collection.insert_one(student_dict)

    student_dict["_id"] = str(result.inserted_id)

    return student_dict


def get_all_students():

    students = list(
        students_collection.find()
    )

    for student in students:
        student["_id"] = str(student["_id"])

    return students


def get_student_by_id(student_id):

    try:

        object_id = ObjectId(student_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid Student ID"
        )

    student = students_collection.find_one(
        {
            "_id": object_id
        }
    )

    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student["_id"] = str(student["_id"])

    return student


def get_student_by_name(name):

    student = students_collection.find_one(
        {
            "name": name
        }
    )

    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student["_id"] = str(student["_id"])

    return student


def update_student_age(name, age):

    result = students_collection.update_one(

        {
            "name": name
        },

        {
            "$set": {
                "age": age
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return result.modified_count


def delete_student(name):

    result = students_collection.delete_one(
        {
            "name": name
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return result.deleted_count