from pydantic import BaseModel

class StudentResponse(BaseModel):
    success: bool
    message: str
    data: dict | None = None