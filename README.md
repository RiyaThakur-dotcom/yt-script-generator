# 🎬 YT Script Generator

Topic do → Full Hinglish YouTube script ready!  
Built with **React + Vite** (frontend) and **FastAPI** (backend) using **OpenRouter free LLaMA model**.

---

## Project Structure

```
yt-script-generator/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── backend/           # FastAPI server
    ├── main.py
    ├── requirements.txt
    └── .env.example
```

---

## Setup & Run

### 1. Backend

```bash
cd backend

# .env file banao
cp .env.example .env
# OPENROUTER_API_KEY apni key se replace karo

# Dependencies install karo
pip install -r requirements.txt

# Server start karo
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

---

### 2. Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## OpenRouter Free API Key Kaise Milegi?

1. Jao [openrouter.ai](https://openrouter.ai)
2. Sign up karo (GitHub se bhi ho jaata hai)
3. **Keys** section → **Create Key**
4. Copy karo aur `.env` mein paste karo

**Free model used:** `meta-llama/llama-3.3-70b-instruct:free`  
Rate limit: ~20 req/min, ~200/day

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Script generate karo |
| GET | `/health` | Server status check |

### POST /generate — Request body:
```json
{
  "topic": "Ek ladki ne 6 mahine mein 1 lakh kaise kamaye",
  "video_type": "story",
  "duration": "medium",
  "tone": "casual"
}
```

---

## Deploy

- **Frontend** → Vercel (`vercel deploy` inside `/frontend`)
- **Backend** → Render (free tier, connect GitHub repo)

After deploy, `App.jsx` mein API URL update karo:
```js
const res = await fetch("https://your-backend.onrender.com/generate", ...)
```
