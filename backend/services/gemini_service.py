import httpx
import json
import os
import asyncio
from datetime import datetime
from supabase import create_client
from prompts.analyst_prompts import (
    player_analysis_prompt,
    compare_players_prompt,
    predicted_xi_prompt,
    series_report_prompt,
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = "cricket-reports"

def get_supabase():
    """Return Supabase client or None if not configured."""
    if not SUPABASE_URL or SUPABASE_URL == "your_supabase_project_url_here":
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase init error: {e}")
        return None

async def upload_to_storage(file_name: str, data: dict):
    """
    Upload a Gemini report to Supabase Storage as JSON.
    Redis is still the primary cache — this is a persistent backup.
    Runs in thread pool so it doesn't block the async event loop.
    """
    def _upload():
        client = get_supabase()
        if not client:
            print("Supabase not configured — skipping upload")
            return
        try:
            payload = json.dumps({
                "data": data,
                "generated_at": datetime.utcnow().isoformat(),
                "file_name": file_name,
            }, indent=2).encode("utf-8")

            client.storage.from_(BUCKET_NAME).upload(
                path=file_name,
                file=payload,
                file_options={"content-type": "application/json", "upsert": "true"},
            )
            print(f"Uploaded to Supabase Storage: {file_name}")
        except Exception as e:
            print(f"Supabase upload error: {e}")

    await asyncio.get_event_loop().run_in_executor(None, _upload)

# ── Gemini API ───────────────────────────────────────────

async def call_gemini(prompt: str) -> dict | None:
    """
    Call Gemini Pro API with a prompt.
    Returns parsed JSON dict or None on failure.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        print("No Gemini API key set — returning None")
        return None

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GEMINI_URL,
                params={"key": GEMINI_API_KEY},
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

            # Extract text from Gemini response
            text = (
                data["candidates"][0]["content"]["parts"][0]["text"]
            )

            # Strip markdown code fences if present
            text = text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            text = text.strip()

            return json.loads(text)

    except json.JSONDecodeError as e:
        print(f"Gemini JSON parse error: {e}")
        return None
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None

# ── Fallback responses ───────────────────────────────────
# Used when Gemini API key is not set or call fails

def fallback_player_report(name: str) -> dict:
    return {
        "form_summary": f"{name} has shown solid recent form with consistent contributions across formats.",
        "strengths": f"{name} possesses a technically sound technique with excellent shot selection against both pace and spin.",
        "weaknesses": "Shows occasional vulnerability to short-pitched deliveries outside off stump in the early innings.",
        "prediction": f"{name} is likely to make a significant contribution in the upcoming match based on current form.",
        "verdict": f"A world-class performer on his day, {name} remains one of the most complete players in international cricket. His ability to adapt to different conditions and formats makes him an invaluable asset to his team.",
    }

def fallback_compare_report(p1: str, p2: str) -> dict:
    return {
        "player1_edge": f"{p1} holds the advantage in terms of consistency and technical correctness across all formats of the game.",
        "player2_edge": f"{p2} edges it in high-pressure situations and has a superior record in knockout matches.",
        "combined_analysis": f"Both {p1} and {p2} are generational talents who define modern cricket. {p1} brings unmatched consistency while {p2} offers match-winning brilliance. In red-ball cricket, {p1} has the edge; in white-ball formats, {p2} is the more dangerous proposition.",
    }

def fallback_xi_report(players: list) -> list:
    reasons = [
        "Exceptional current form and technical ability make this player an automatic selection.",
        "Dominates in these pitch conditions with a proven record across similar venues.",
        "Brings crucial balance to the side with significant contributions both batting and bowling.",
        "Proven match-winner whose experience and temperament are invaluable in big games.",
        "Consistent performer whose reliability at the top of the order sets up the innings.",
        "Lethal with the ball in these conditions with an outstanding recent record.",
        "Excellent form in the last five series makes this selection straightforward.",
        "Key wicket-taker who consistently breaks partnerships at crucial moments.",
        "Provides vital lower-order depth alongside economy with the ball.",
        "Leadership qualities and big-match experience make this pick essential.",
        "Brings match-winning versatility that gives the captain multiple options.",
    ]
    return [
        {"name": p, "reason": reasons[i % len(reasons)]}
        for i, p in enumerate(players)
    ]

def fallback_series_report(player: str, series: str) -> dict:
    return {
        "series_report": f"{player} delivered a memorable campaign in {series}, producing key innings at crucial moments throughout the series. The performances showcased adaptability across different match situations and conditions, reinforcing their status as a match-winner at the highest level. This series further cements their place as an automatic selection going forward.",
    }

# ── Public service functions ─────────────────────────────

async def generate_player_report(player: dict) -> dict:
    """Generate AI analyst report for a single player."""
    prompt = player_analysis_prompt(player)
    result = await call_gemini(prompt)

    if result is None:
        result = fallback_player_report(player["name"])

    # Upload to Azure Blob as persistent backup (non-blocking)
    blob_name = f"{player['name'].lower().replace(' ', '_')}_player_report.json"
    asyncio.create_task(upload_to_storage(blob_name, result))

    return result

async def generate_compare_report(player1: dict, player2: dict) -> dict:
    """Generate AI comparison report for two players."""
    prompt = compare_players_prompt(player1, player2)
    result = await call_gemini(prompt)

    if result is None:
        result = fallback_compare_report(player1["name"], player2["name"])

    blob_name = (
        f"{player1['name'].lower().replace(' ', '_')}_vs_"
        f"{player2['name'].lower().replace(' ', '_')}_compare.json"
    )

    return result

async def generate_xi_report(players: list, match_type: str, pitch_type: str) -> list:
    """Generate AI reasoning for predicted XI."""
    prompt = predicted_xi_prompt(players, match_type, pitch_type)
    result = await call_gemini(prompt)

    if result is None or "players" not in result:
        return fallback_xi_report(players)

    blob_name = f"xi_{match_type.lower()}_{pitch_type.lower().replace('-', '_')}.json"
    asyncio.create_task(upload_to_blob(blob_name, result))

    return result["players"]

async def generate_series_report(player: dict, series_name: str) -> dict:
    """Generate AI series report for a player."""
    prompt = series_report_prompt(player, series_name)
    result = await call_gemini(prompt)

    if result is None:
        result = fallback_series_report(player["name"], series_name)

    blob_name = (
        f"{player['name'].lower().replace(' ', '_')}_"
        f"{series_name.lower().replace(' ', '_')}_series.json"
    )
    asyncio.create_task(upload_to_blob(blob_name, result))

    return result