from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import json
import google.generativeai as genai
import ast
import re
from dotenv import load_dotenv
import os
import uvicorn

load_dotenv()

#TODO: ADD A SOLUTION VALUE

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_response(text):
    # Remove backticks, smart quotes, and strip whitespace
    text = text.replace('`', '').replace('“', '"').replace('”', '"').replace('’', "'").strip()
    # Remove markdown artifacts
    text = re.sub(r'^\s*```[a-zA-Z]*', '', text, flags=re.MULTILINE)
    text = re.sub(r'```\s*$', '', text, flags=re.MULTILINE)
    # Remove trailing periods after numbers (e.g., 31.)
    text = re.sub(r'(?<=\d)\.(?=[^\d]|$)', '.0', text)
    # Fix unquoted units in 'result' fields (e.g., 'result': -28.1 m/s -> 'result': '-28.1 m/s')
    text = re.sub(
        r"('result'\s*:\s*)(-?\d+(?:\.\d+)?\s*[a-zA-Z/°^²³μΩ]+)",
        lambda m: f"{m.group(1)}'{m.group(2).strip()}'",
        text
    )
    return text

def analyze_image(img: Image.Image):
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    prompt = (
        f"You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them. "
        f"Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). "
        f"For example: "
        f"Q. 2 + 3 * 4 "
        f"(3 * 4) => 12, 2 + 12 = 14. "
        f"Q. 2 + 3 + 5 * 4 - 8 / 2 "
        f"5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21. "
        f"YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, AND ONLY ONE CASE SHALL APPLY EVERY TIME: "
        f"1. Simple math expressions (e.g., 2 + 2): Return [{{'expr': expression, 'result': answer}}]. "
        f"2. Systems of equations: Return a comma-separated list of dicts like [{{'expr': 'x', 'result': 2, 'assign': True}}, ...]. "
        f"3. Value assignments like x = 2: Use same dict format with 'assign': True. "
        f"4. Word problems with drawings: Return [{{'expr': explanation, 'result': answer}}]. "
        f"5. Abstract ideas in drawings: Use same format. "
        f"DO NOT USE BACKTICKS OR MARKDOWN. "
        f"Return valid Python list/dict that can be parsed using ast.literal_eval."
    )
    response = model.generate_content([prompt, img])
    print(response.text)
    answers = []
    try:
        cleaned = clean_response(response.text)
        answers = ast.literal_eval(cleaned)
    except Exception as e:
        print(f"Error in parsing response from Gemini API: {e}")
        print(f"Raw response: {response.text}")
    print('returned answer ', answers)
    for answer in answers:
        answer['assign'] = answer.get('assign', False)
    return answers

@app.post("/solve")
async def solve(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        result = analyze_image(img)
        return JSONResponse(content={"result": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
