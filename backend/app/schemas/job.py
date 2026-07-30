from pydantic import BaseModel

class Job(BaseModel):

    title: str

    company: str

    location: str

    skills: list[str]

    description: str