import os
import json
import re
import google.generativeai as genai
from schemas import ParsedResume


SYSTEM_PROMPT = """You are an expert resume parser. Extract structured information from the provided resume text and return ONLY valid JSON — no explanation, no markdown, no code fences.

The JSON must strictly match this structure:
{
  "meta": {
    "name": "",
    "title": "",
    "bio": "",
    "email": "",
    "phone": "",
    "location": "",
    "photo_url": "",
    "linkedin": "",
    "github": "",
    "twitter": "",
    "website": ""
  },
  "skills": [
    { "category": "Backend", "name": "Python", "proficiency": 4, "icon": "" }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "start_date": "",
      "end_date": "",
      "is_current": false,
      "location": "",
      "description": "",
      "order_index": 0
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech_stack": ["Python", "React"],
      "github_url": "",
      "live_url": "",
      "image_url": "",
      "order_index": 0
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "start_year": "",
      "end_year": "",
      "gpa": "",
      "description": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "credential_url": "",
      "description": ""
    }
  ]
}

Rules:
- proficiency is an integer from 1 (beginner) to 5 (expert)
- Infer proficiency from years of experience or context clues
- Group skills into categories: Backend, Frontend, DevOps, Database, Mobile, AI/ML, Other
- For is_current: true if currently working there
- bio should be a professional 2-3 sentence summary synthesized from the resume
- If a field has no data, use empty string "" or empty array []
- Never include null values
- Return ONLY the JSON object, nothing else
"""


def parse_resume_with_claude(resume_text: str) -> ParsedResume:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in environment")

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_PROMPT,
    )

    response = model.generate_content(
        f"Parse this resume and return the JSON:\n\n{resume_text}",
        generation_config=genai.GenerationConfig(
            temperature=0.1,
            max_output_tokens=8192,
        ),
    )

    raw = response.text.strip()

    # Strip markdown code fences if model wraps in them
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\n\nRaw response:\n{raw[:500]}")

    return ParsedResume(**data)
