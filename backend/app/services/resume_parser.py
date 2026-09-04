import fitz
import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def extract_text_from_pdf(file_bytes):
    """
    Extract text directly from PDF bytes.

    The PDF is processed in memory instead of being
    permanently saved to the server filesystem.
    """

    text = ""

    pdf = fitz.open(
        stream=file_bytes,
        filetype="pdf"
    )

    try:
        for page in pdf:
            text += page.get_text()
    finally:
        pdf.close()

    return text


def analyze_resume(text):
    prompt = f"""
You are an expert resume parser and career-profile analyzer.

Analyze the resume text below and return ONLY valid JSON.

Use exactly this structure:

{{
    "skills": [],
    "education": [],
    "experience": [],
    "projects": [],
    "summary": ""
}}

IMPORTANT RULES:

1. SKILLS
- Extract ALL technical skills explicitly mentioned anywhere in the resume.
- Look for skills in sections such as Skills, Technical Skills, Technologies,
  Tools, Programming Languages, Frameworks, Libraries, Databases,
  Certifications, Projects, Education, and Work Experience.
- Do NOT restrict skill extraction to a section named "Skills".
- Include programming languages, frameworks, libraries, databases,
  developer tools, cloud platforms, technologies and relevant technical
  methodologies.
- Do not invent skills that are not present in the resume.
- Preserve recognizable skill names such as Python, Java, SQL, React,
  TensorFlow, AWS, Git, Docker, etc.

2. EDUCATION
- Extract degrees, diplomas, universities, colleges and relevant
  academic qualifications.
- Include dates when clearly available.

3. EXPERIENCE
- Extract employment and internship experience.
- Include organization, role and dates when available.
- Do NOT put academic projects here unless they are explicitly described
  as professional/work experience.

4. PROJECTS
- Extract academic, personal and professional projects.
- Include the project name and important technologies used when available.

5. SUMMARY
- Write a concise professional summary based ONLY on information
  present in the resume.
- Do not copy placeholder instructions or generic template text.

6. GENERAL
- Do not invent information.
- Do not include explanations outside the JSON.
- Do not use Markdown code fences.
- Return valid JSON that can be parsed directly by Python's json.loads().

Resume text:

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