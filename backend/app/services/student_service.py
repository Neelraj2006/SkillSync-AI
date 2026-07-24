from app.database import students_collection

def create_student(student_dict):

    result = students_collection.insert_one(student_dict)

    return str(result.inserted_id)

def get_all_students():

    students = list(students_collection.find())

    for student in students:
        student["_id"] = str(student["_id"])

    return students

def get_student_by_name(name):

    student = students_collection.find_one(
        {
            "name": name
        }
    )

    if student:

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

    return result.modified_count

def delete_student(name):

    result = students_collection.delete_one(
        {
            "name": name
        }
    )

    return result.deleted_count