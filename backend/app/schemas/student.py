from pydantic import BaseModel, Field

class Student(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Student Full Name"
    )

    age: int = Field(
        ...,
        ge=16,
        le=100,
        description="Student Age"
    )

    course: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Course Name"
    )