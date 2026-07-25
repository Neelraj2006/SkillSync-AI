from pydantic import BaseModel

class StudentResponse(BaseModel):
    status: str
    message: str
    student: dict