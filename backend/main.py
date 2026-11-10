
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from analytics import calculate_metrics
from ai_service import generate_kam_response


# Request model must be defined outside all functions

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []

    


app = FastAPI(title="Snapdeal AI Virtual KAM")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://mini-virtual-kam-ai-voice-assistant.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Snapdeal AI Virtual KAM Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/analytics")
def get_analytics():
    return calculate_metrics()



@app.post("/chat")
def chat(request: ChatRequest):
    metrics = calculate_metrics()

    reply = generate_kam_response(
        request.message,
        metrics,
        request.history
    )

    return {
        "reply": reply,
        "metrics": metrics
    }
