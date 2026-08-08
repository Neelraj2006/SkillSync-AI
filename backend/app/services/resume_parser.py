import fitz
import os
import json

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

Analyze the following resume and return ONLY valid JSON.

Use exactly this format:

{{
    "skills": [],
    "education": [],
    "experience": [],
    "summary": ""
}}

Rules:
- "skills" should contain technical skills, programming languages,
  frameworks, libraries, databases, tools and technologies.
- "education" should contain degrees, universities, colleges and
  relevant academic qualifications.
- "experience" should contain work experience, internships and projects.
- "summary" should contain a short professional summary.
- Do not include explanations outside the JSON.
- Do not use Markdown code fences.

Resume:

{text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    result = response.text.strip()

    # Remove Markdown code fences if Gemini happens to return them
    if result.startswith("```json"):
        result = result[7:]

    if result.startswith("```"):
        result = result[3:]

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    return json.loads(result)