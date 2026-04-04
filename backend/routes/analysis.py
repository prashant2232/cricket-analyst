from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.player_service import get_player, select_xi
from services.gemini_service import (
    generate_player_report,
    generate_compare_report,
    generate_xi_report,
    generate_series_report,
)

router = APIRouter()

class PlayerRequest(BaseModel):
    player_name: str

class CompareRequest(BaseModel):
    player1: str
    player2: str

class XIRequest(BaseModel):
    match_type: str
    pitch_type: str

@router.post("/analyze/player")
async def analyze_player(request: PlayerRequest):
    player = await get_player(request.player_name)
    if not player:
        raise HTTPException(
            status_code=404,
            detail=f"Player '{request.player_name}' not found"
        )
    report = await generate_player_report(player)
    return {"status": "success", "data": report}

@router.post("/analyze/compare")
async def compare_players(request: CompareRequest):
    p1 = await get_player(request.player1)
    p2 = await get_player(request.player2)
    if not p1:
        raise HTTPException(status_code=404, detail=f"Player '{request.player1}' not found")
    if not p2:
        raise HTTPException(status_code=404, detail=f"Player '{request.player2}' not found")
    report = await generate_compare_report(p1, p2)
    return {"status": "success", "data": report}

@router.post("/analyze/xi")
async def generate_xi(request: XIRequest):
    selected = select_xi(request.match_type, request.pitch_type)
    players_with_reasons = await generate_xi_report(
        selected, request.match_type, request.pitch_type
    )
    return {"status": "success", "data": {"players": players_with_reasons}}

@router.post("/analyze/series/{player_name}/{series_name}")
async def series_report(player_name: str, series_name: str):
    player = await get_player(player_name)
    if not player:
        raise HTTPException(
            status_code=404,
            detail=f"Player '{player_name}' not found"
        )
    report = await generate_series_report(player, series_name)
    return {"status": "success", "data": report}