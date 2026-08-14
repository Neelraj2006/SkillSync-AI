from fastapi import APIRouter, Depends, status

from app.schemas.student import Student
from app.schemas.response import StudentResponse

from app.services.student_service import (
    create_student,
    get_all_students,
    get_student_by_name,
    get_student_by_id,
    update_student_age,
    delete_student
)

from app.utils.auth import verify_token
from app.utils.response import success_response


router = APIRouter(
    prefix="/student",
    tags=["Students"]
)


# -------------------------
# CREATE STUDENT
# -------------------------

@router.post(
    "/",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Student",
    description="Creates a new student in MongoDB."
)
def register_student(student: Student):

    student_dict = student.model_dump()

    created_student = create_student(
        student_dict
    )

    return success_response(
        message="Student Registered Successfully",
        data=created_student
    )


# -------------------------
# GET ALL STUDENTS
# -------------------------

@router.get("/")
def get_students():

    students = get_all_students()

    return success_response(
        message="Students fetched successfully",
        data=students
    )


# -------------------------
# GET STUDENT BY NAME
# -------------------------

@router.get("/name/{name}")
def get_student_by_name_route(
    name: str,
    token_data=Depends(verify_token)
):

    student = get_student_by_name(name)

    return success_response(
        "Student Found",
        student
    )


# -------------------------
# GET STUDENT BY ID
# -------------------------

@router.get("/{student_id}")
def get_student(
    student_id: str
):

    student = get_student_by_id(student_id)

    return success_response(
        "Student Found",
        student
    )


# -------------------------
# UPDATE STUDENT AGE
# -------------------------

@router.put(
    "/{name}",
    summary="Update Student Age",
    description="Updates the age of a student using their name."
)
def update_student(
    name: str,
    age: int
):

    update_student_age(
        name,
        age
    )

    return success_response(
        message="Student Updated Successfully"
    )


# -------------------------
# DELETE STUDENT
# -------------------------

@router.delete(
    "/{name}",
    summary="Delete Student",
    description="Deletes a student using their name."
)
def remove_student(name: str):

    delete_student(name)

    return success_response(
        message="Student Deleted Successfully"
    )