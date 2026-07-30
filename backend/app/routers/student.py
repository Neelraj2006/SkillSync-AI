from fastapi import APIRouter
from app.schemas.student import Student
from app.services.student_service import create_student
from app.services.student_service import (
    create_student,
    get_all_students,
    get_student_by_name,
    get_student_by_id,
    update_student_age,
    delete_student
)
from app.schemas.response import StudentResponse
from fastapi import status
from app.utils.response import success_response, error_response
from fastapi import Depends
from app.utils.auth import verify_token

router = APIRouter(
    prefix="/student",
    tags=["Students"]
)

@router.get("/student/{student_id}")
def get_student(student_id: str):

    student = get_student_by_id(student_id)

    return success_response(
        "Student Found",
        student
    )

@router.post(
    "/student",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Student",
    description="Creates a new student in MongoDB."
)
def register_student(student: Student):

    student_dict = student.model_dump()

    student = create_student(student_dict)

    return success_response(
    message="Student Registered Successfully",
    data=student
    )

@router.get("/students")
def get_students():

    students = get_all_students()

    return success_response(
    message="Students fetched successfully",
    data=students
)

@router.get("/student/name/{name}")
def get_student(
    name: str,
    user=Depends(verify_token)
):

    student = get_student_by_name(name)

    if student is None:

        return error_response(
            "Student Not Found"
        )

    return success_response(
        "Student Found",
        student
    )

@router.put(
    "/student/{name}",
    summary="Update Student Age",
    description="Updates the age of a student using their name."
)
def update_student(name: str, age: int):

    updated = update_student_age(name, age)

    if updated == 0:

        return {
            "message": "Student Not Found"
        }

    return success_response(
        message="Student Updated Successfully"
    )

@router.delete(
    "/student/{name}",
    summary="Delete Student",
    description="Deletes a student using their name."
)
def remove_student(name: str):

    deleted = delete_student(name)

    if deleted == 0:

        return {
            "message": "Student Not Found"
        }

    return {
        "message": "Student Deleted Successfully"
    }