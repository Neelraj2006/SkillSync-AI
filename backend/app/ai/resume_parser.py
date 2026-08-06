import fitz
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def extract_text_from_pdf(file_path):

    text = ""

    pdf = fitz.open(file_path)

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text


def analyze_resume(text):

    prompt = f"""
You are an AI Resume Analyzer.

Return ONLY valid JSON.

Format:

{{
    "skills": [],
    "education": [],
    "experience": [],
    "summary": ""
}}

Resume:

{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    result = response.text

    result = result.replace("```json", "")
    result = result.replace("```", "")

    return result.strip()