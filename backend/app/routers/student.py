from fastapi import APIRouter
from app.schemas.student import Student
from app.database import students_collection

router = APIRouter()

@router.get("/student/{student_id}")
def get_student(student_id: int):
    return {
        "student_id": student_id
    }

@router.post("/student")
def create_student(student: Student):

    student_dict = student.model_dump()

    result = students_collection.insert_one(student_dict)

    return {
        "status": "success",
        "message": "Student Registered Successfully",
        "inserted_id": str(result.inserted_id)
    }

@router.get("/students")
def get_students():
    return{
        "total_students":len(students),
        "students":students
    }