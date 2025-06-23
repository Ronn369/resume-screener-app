# app.py
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import PyPDF2
import io

app = FastAPI()

# CORS (Frontend <> Backend Communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/match")
async def match_resume(
    resume: UploadFile = File(...),
    jobDescription: str = Form(...)
):
    try:
        contents = await resume.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text()

        # Dummy logic for matching (replace this with your real ML/NLP model)
        score = 80  # pretend ML model result
        jobs = [
            {"title": "Frontend Developer", "description": "React, HTML, CSS"},
            {"title": "Backend Developer", "description": "Python, Django"},
        ]

        return {
            "matchScore": score,
            "matchedJobs": jobs
        }

    except Exception as e:
        print("❌ Error:", e)
        return {"error": "Resume processing failed"}
