from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="YT Script Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = MODEL = "openrouter/auto"
class ScriptRequest(BaseModel):
    topic: str
    video_type: str       # story, tutorial, vlog, motivation, facts
    duration: str         # short, medium, long
    tone: str             # casual, funny, motivational, dramatic

TONE_MAP = {
    "casual":       "casual Hinglish (natural mix of Hindi and English)",
    "funny":        "funny and meme-worthy Hinglish with jokes and relatable humor",
    "motivational": "motivational and inspiring Hinglish that pumps up the viewer",
    "dramatic":     "dramatic storytelling Hinglish with suspense and emotion",
}

DURATION_MAP = {
    "short":  "3-5 minute",
    "medium": "7-10 minute",
    "long":   "12-15 minute",
}

VTYPE_MAP = {
    "story":      "storytelling",
    "tutorial":   "tutorial/how-to",
    "vlog":       "personal vlog",
    "motivation": "motivational",
    "facts":      "educational facts",
}

def build_prompt(req: ScriptRequest) -> str:
    return f"""You are a top Indian YouTube scriptwriter.
Write a complete {DURATION_MAP[req.duration]} {VTYPE_MAP[req.video_type]} YouTube script
in {TONE_MAP[req.tone]} style for this topic: "{req.topic}"

Return ONLY a JSON object (no markdown, no backticks) with this structure:
{{
  "title": "catchy video title",
  "estimated_duration": "X min",
  "hook": "opening 30-45 seconds script",
  "intro": "intro section script",
  "main_sections": [
    {{"heading": "section name", "content": "script content"}},
    {{"heading": "section name", "content": "script content"}}
  ],
  "cta": "closing call to action script"
}}

Write naturally in Hinglish. Use 'yaar', 'dekho', 'suno', 'bhai/behen' naturally.
Each section should be full sentences the creator can read out loud."""


@app.post("/generate")
async def generate_script(req: ScriptRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set in .env")

    prompt = build_prompt(req)

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=60,
    )

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"OpenRouter error: {response.text}")

    raw = response.json()["choices"][0]["message"]["content"]
    clean = raw.replace("```json", "").replace("```", "").strip()

    try:
        script = json.loads(clean)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI ne valid JSON nahi diya. Retry karo.")

    return {"success": True, "script": script}


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}
