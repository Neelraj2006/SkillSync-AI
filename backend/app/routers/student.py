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

    students = list(students_collection.find())

    for student in students:
        student["_id"] = str(student["_id"])

    return {
        "total_students": len(students),
        "students": students
    }

@router.get("/student/name/{name}")
def get_student_by_name(name: str):

    student = students_collection.find_one({"name": name})

    if student is None:
        return {
            "message": "Student Not Found"
        }

    student["_id"] = str(student["_id"])

    return student

@router.put("/student/{name}")
def update_student(name: str, age: int, Course:str):
    result = students_collection.update_one(
        {"name": name},
        {
            "$set": {
                "age": age,
                "Course":Course
            }
        }
    )

    if result.modified_count == 0:
        return {
            "message": "Student Not Found"
        }
    return {
        "message": "Student Updated Successfully"
    }

@router.delete("/student/{name}")
def delete_student(name: str):

    result = students_collection.delete_one(
        {
            "name": name
        }
    )

    if result.deleted_count == 0:

        return {
            "message": "Student Not Found"
        }

    return {
        "message": "Student Deleted Successfully"
    }