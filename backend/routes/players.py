from fastapi import APIRouter, HTTPException
from services.player_service import get_all_players, get_player

router = APIRouter()

@router.get("/players")
async def list_players():
    players = await get_all_players()
    return {"status": "success", "data": players}

@router.get("/players/{name}")
async def player_detail(name: str):
    player = await get_player(name)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{name}' not found")
    return {"status": "success", "data": player}