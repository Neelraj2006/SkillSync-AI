from fastapi import APIRouter
from app.schemas.student import Student

router = APIRouter()
students=[]

@router.get("/student/{student_id}")
def get_student(student_id: int):
    return {
        "student_id": student_id
    }

@router.post("/student")
def create_student(student: Student):
    students.append(student)
    return {
        "status": "success",
        "message": "Student Registered Successfully",
        "student": student
    }

@router.get("/students")
def get_students():
    return{
        "total_students":len(students),
        "students":students
    }