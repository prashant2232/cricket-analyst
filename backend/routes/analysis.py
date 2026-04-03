from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.player_service import get_player, select_xi

router = APIRouter()

class PlayerRequest(BaseModel):
    player_name: str

class CompareRequest(BaseModel):
    player1: str
    player2: str

class XIRequest(BaseModel):
    match_type: str
    pitch_type: str

# ── Stub response helpers ────────────────────────────────
# These return realistic fake AI responses for now.
# On Day 5 we swap these with real Gemini API calls.

def stub_player_report(name: str) -> dict:
    return {
        "form_summary": f"{name} has been in solid form recently, showing consistency across formats.",
        "strengths": f"{name} excels against both pace and spin, with a technically sound technique.",
        "weaknesses": "Slight vulnerability to short-pitched deliveries outside off stump early in innings.",
        "prediction": f"{name} is likely to contribute significantly in the next match.",
        "verdict": f"A match-winner on his day, {name} remains one of the most complete batsmen in world cricket."
    }

def stub_compare_report(p1: str, p2: str) -> dict:
    return {
        "player1_edge": f"{p1} has the edge in Test cricket due to superior average.",
        "player2_edge": f"{p2} performs better in pressure situations and limited overs.",
        "combined_analysis": f"Both {p1} and {p2} are world-class. {p1} edges it in red-ball cricket while {p2} dominates in white-ball formats."
    }

def stub_xi_report(players: list, match_type: str, pitch_type: str) -> list:
    reasons = [
        "Exceptional form and technical ability make this player a must-pick.",
        "Dominates on this pitch type with impressive recent series performances.",
        "Brings balance to the side with both bat and ball.",
        "Proven match-winner who thrives under pressure.",
        "Consistent performer whose experience is invaluable.",
        "Lethal with the ball in these conditions.",
        "Excellent recent form makes this selection obvious.",
        "Strong record against top-order batsmen in similar conditions.",
        "Provides crucial depth and versatility to the lineup.",
        "Key wicket-taker who can change the game at any moment.",
        "Brings leadership and composure to the middle order.",
    ]
    return [
        {"name": player, "reason": reasons[i % len(reasons)]}
        for i, player in enumerate(players)
    ]

def stub_series_report(player: str, series: str) -> dict:
    return {
        "series_report": f"{player} had a memorable campaign in {series}, displaying fine form throughout. Key innings came at crucial moments, showcasing adaptability across different match situations."
    }

# ── Endpoints ────────────────────────────────────────────

@router.post("/analyze/player")
async def analyze_player(request: PlayerRequest):
    player = await get_player(request.player_name)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{request.player_name}' not found")
    report = stub_player_report(request.player_name.title())
    return {"status": "success", "data": report}

@router.post("/analyze/compare")
async def compare_players(request: CompareRequest):
    p1 = await get_player(request.player1)
    p2 = await get_player(request.player2)
    if not p1:
        raise HTTPException(status_code=404, detail=f"Player '{request.player1}' not found")
    if not p2:
        raise HTTPException(status_code=404, detail=f"Player '{request.player2}' not found")
    report = stub_compare_report(request.player1.title(), request.player2.title())
    return {"status": "success", "data": report}

@router.post("/analyze/xi")
async def generate_xi(request: XIRequest):
    selected = select_xi(request.match_type, request.pitch_type)
    players_with_reasons = stub_xi_report(selected, request.match_type, request.pitch_type)
    return {"status": "success", "data": {"players": players_with_reasons}}

@router.post("/analyze/series/{player_name}/{series_name}")
async def series_report(player_name: str, series_name: str):
    player = await get_player(player_name)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{player_name}' not found")
    report = stub_series_report(player_name.title(), series_name)
    return {"status": "success", "data": report}