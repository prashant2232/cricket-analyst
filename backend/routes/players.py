from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/players")
async def get_all_players():
    return {"message": "coming soon"}

@router.get("/players/{name}")
async def get_player(name: str):
    return {"message": f"coming soon - {name}"}