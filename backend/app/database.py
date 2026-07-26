from pymongo import MongoClient
from app.config import (
    MONGO_URI,
    DATABASE_NAME,
    STUDENT_COLLECTION,
    USER_COLLECTION
)

MONGO_URL = "mongodb://localhost:27017"

from app.config import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

students_collection = db[STUDENT_COLLECTION]

users_collection = db[USER_COLLECTION]

try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully!")
except Exception as e:
    print("MongoDB Connection Failed")
    print(e)