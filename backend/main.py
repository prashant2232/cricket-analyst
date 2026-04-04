from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Cricket Analyst API", version="1.0.0")

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers (we'll fill these in later)
from routes import players, analysis
app.include_router(players.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Cricket Analyst API is running"}