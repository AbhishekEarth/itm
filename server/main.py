from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ITM GOI Clone API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; refine for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Event(BaseModel):
    id: int
    title: str
    date: str
    description: str

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

# Mock Data
events = [
    {
        "id": 1,
        "title": "International Conference on Advanced Computing",
        "date": "15 Oct 2026",
        "description": "Join us for the 3rd International Conference focusing on AI and Cloud Computing."
    },
    {
        "id": 2,
        "title": "Alumni Meet 2026",
        "date": "20 Nov 2026",
        "description": "An evening to reconnect, reminisce, and celebrate the success of our alumni."
    },
    {
        "id": 3,
        "title": "Tech Fest - 'Avinya'",
        "date": "05 Dec 2026",
        "description": "Annual technical festival featuring coding competitions, robotics, and more."
    }
]

# Routes
@app.get("/")
async def root():
    return {"message": "ITM GOI Clone API is running"}

@app.get("/api/events", response_model=List[Event])
async def get_events():
    return events

@app.post("/api/contact")
async def contact(form: ContactForm):
    # Simulate saving to DB
    if not form.name or not form.email or not form.message:
        raise HTTPException(status_code=400, detail="All fields are required")
    return {"success": True, "message": "Message received successfully!"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
