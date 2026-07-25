from fastapi import APIRouter
from app.schemas.student import Student
from app.services.student_service import create_student
from app.services.student_service import (
    create_student,
    get_all_students,
    get_student_by_name,
    update_student_age,
    delete_student
)
from app.schemas.response import StudentResponse
from fastapi import status

router = APIRouter()

@router.get("/student/{student_id}")
def get_student(student_id: int):
    return {
        "student_id": student_id
    }

@router.post(
    "/student",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED
)
def register_student(student: Student):

    student_dict = student.model_dump()

    student = create_student(student_dict)

    return {
        "status": "success",
        "message": "Student Registered Successfully",
        "student": student
    }

@router.get("/students")
def get_students():

    students = get_all_students()

    return {
        "total_students": len(students),
        "students": students
    }

@router.get("/student/name/{name}")
def get_student(name: str):

    student = get_student_by_name(name)

    return student

@router.put("/student/{name}")
def update_student(name: str, age: int):

    updated = update_student_age(name, age)

    if updated == 0:

        return {
            "message": "Student Not Found"
        }

    return {
        "message": "Student Updated Successfully"
    }

@router.delete("/student/{name}")
def remove_student(name: str):

    deleted = delete_student(name)

    if deleted == 0:

        return {
            "message": "Student Not Found"
        }

    return {
        "message": "Student Deleted Successfully"
    }