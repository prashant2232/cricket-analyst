import httpx
import os
import json
import redis.asyncio as redis
from data.player_context import PLAYER_CONTEXT

CRICDATA_API_KEY = os.getenv("CRICDATA_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

PLAYER_PROFILES = {
    "virat kohli":     {"country": "India",        "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm medium"},
    "rohit sharma":    {"country": "India",        "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm offbreak"},
    "shubman gill":    {"country": "India",        "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm offbreak"},
    "kl rahul":        {"country": "India",        "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm medium"},
    "shreyas iyer":    {"country": "India",        "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm medium"},
    "hardik pandya":   {"country": "India",        "role": "Allrounder", "batting_style": "Right-hand bat", "bowling_style": "Right-arm fast-medium"},
    "ravindra jadeja": {"country": "India",        "role": "Allrounder", "batting_style": "Left-hand bat",  "bowling_style": "Slow left-arm orthodox"},
    "jasprit bumrah":  {"country": "India",        "role": "Bowler",     "batting_style": "Right-hand bat", "bowling_style": "Right-arm fast"},
    "mohammed shami":  {"country": "India",        "role": "Bowler",     "batting_style": "Right-hand bat", "bowling_style": "Right-arm fast-medium"},
    "kuldeep yadav":   {"country": "India",        "role": "Bowler",     "batting_style": "Left-hand bat",  "bowling_style": "Left-arm wrist spin"},
    "babar azam":      {"country": "Pakistan",     "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm medium"},
    "kane williamson": {"country": "New Zealand",  "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm offbreak"},
    "joe root":        {"country": "England",      "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm offbreak"},
    "steve smith":     {"country": "Australia",    "role": "Batsman",    "batting_style": "Right-hand bat", "bowling_style": "Right-arm legbreak"},
    "david warner":    {"country": "Australia",    "role": "Batsman",    "batting_style": "Left-hand bat",  "bowling_style": "Right-arm offbreak"},
    "ben stokes":      {"country": "England",      "role": "Allrounder", "batting_style": "Left-hand bat",  "bowling_style": "Right-arm fast-medium"},
    "pat cummins":     {"country": "Australia",    "role": "Bowler",     "batting_style": "Right-hand bat", "bowling_style": "Right-arm fast"},
    "shaheen afridi":  {"country": "Pakistan",     "role": "Bowler",     "batting_style": "Left-hand bat",  "bowling_style": "Left-arm fast"},
    "trent boult":     {"country": "New Zealand",  "role": "Bowler",     "batting_style": "Right-hand bat", "bowling_style": "Left-arm fast-medium"},
    "kagiso rabada":   {"country": "South Africa", "role": "Bowler",     "batting_style": "Right-hand bat", "bowling_style": "Right-arm fast"},
}

PLAYER_CAREER_STATS = {
    "virat kohli":     {"matches": 292, "runs": 13848, "average": 57.32, "strike_rate": 93.62, "hundreds": 50, "fifties": 72},
    "rohit sharma":    {"matches": 264, "runs": 10709, "average": 48.96, "strike_rate": 89.18, "hundreds": 31, "fifties": 59},
    "shubman gill":    {"matches": 65,  "runs": 3127,  "average": 56.85, "strike_rate": 99.02, "hundreds": 9,  "fifties": 15},
    "kl rahul":        {"matches": 72,  "runs": 2828,  "average": 46.36, "strike_rate": 88.77, "hundreds": 6,  "fifties": 20},
    "shreyas iyer":    {"matches": 67,  "runs": 2564,  "average": 45.78, "strike_rate": 97.34, "hundreds": 6,  "fifties": 16},
    "hardik pandya":   {"matches": 118, "runs": 3068,  "average": 33.32, "strike_rate": 124.76,"hundreds": 1,  "fifties": 18},
    "ravindra jadeja": {"matches": 201, "runs": 2756,  "average": 32.42, "strike_rate": 86.57, "hundreds": 0,  "fifties": 13},
    "jasprit bumrah":  {"matches": 87,  "runs": 98,    "average": 7.00,  "strike_rate": 73.68, "hundreds": 0,  "fifties": 0},
    "mohammed shami":  {"matches": 101, "runs": 132,   "average": 6.28,  "strike_rate": 78.10, "hundreds": 0,  "fifties": 0},
    "kuldeep yadav":   {"matches": 101, "runs": 145,   "average": 8.05,  "strike_rate": 91.19, "hundreds": 0,  "fifties": 0},
    "babar azam":      {"matches": 115, "runs": 5571,  "average": 57.43, "strike_rate": 88.13, "hundreds": 19, "fifties": 33},
    "kane williamson": {"matches": 164, "runs": 6554,  "average": 47.48, "strike_rate": 81.61, "hundreds": 14, "fifties": 40},
    "joe root":        {"matches": 163, "runs": 6957,  "average": 49.69, "strike_rate": 86.66, "hundreds": 17, "fifties": 42},
    "steve smith":     {"matches": 132, "runs": 4740,  "average": 43.49, "strike_rate": 86.97, "hundreds": 11, "fifties": 29},
    "david warner":    {"matches": 161, "runs": 6932,  "average": 45.30, "strike_rate": 95.97, "hundreds": 18, "fifties": 39},
    "ben stokes":      {"matches": 105, "runs": 2924,  "average": 36.55, "strike_rate": 95.70, "hundreds": 3,  "fifties": 21},
    "pat cummins":     {"matches": 106, "runs": 664,   "average": 19.52, "strike_rate": 103.11,"hundreds": 0,  "fifties": 1},
    "shaheen afridi":  {"matches": 68,  "runs": 231,   "average": 10.04, "strike_rate": 76.49, "hundreds": 0,  "fifties": 0},
    "trent boult":     {"matches": 107, "runs": 393,   "average": 13.10, "strike_rate": 94.46, "hundreds": 0,  "fifties": 0},
    "kagiso rabada":   {"matches": 90,  "runs": 421,   "average": 14.96, "strike_rate": 95.24, "hundreds": 0,  "fifties": 0},
}

PLAYER_IDS = {
    "virat kohli":      "c2646af6-a82f-4e95-b8c2-3f971bae8d3b",
    "rohit sharma":     "9dfab597-5a1f-4b6e-9b7e-4a5b2e8f7c3d",
    "shubman gill":     "b7a3e5f2-1c4d-4e8f-9a2b-3d6e7f8g9h0i",
    "kl rahul":         "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "shreyas iyer":     "d4e5f6a7-b8c9-0123-def0-123456789abc",
    "hardik pandya":    "e7f8a9b0-c1d2-3456-7890-abcdef123456",
    "ravindra jadeja":  "f0a1b2c3-d4e5-6789-0123-456789abcdef",
    "jasprit bumrah":   "a3b4c5d6-e7f8-9012-3456-789abcdef012",
    "mohammed shami":   "b6c7d8e9-f0a1-2345-6789-0abcdef01234",
    "kuldeep yadav":    "c9d0e1f2-a3b4-5678-9012-3456789abcde",
    "babar azam":       "d2e3f4a5-b6c7-8901-2345-6789abcdef01",
    "kane williamson":  "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
    "joe root":         "f8a9b0c1-d2e3-4567-8901-234567890abc",
    "steve smith":      "a1b2c3d4-e5f6-7890-abcd-ef1234567891",
    "david warner":     "b4c5d6e7-f8a9-0123-4567-890abcdef123",
    "ben stokes":       "c7d8e9f0-a1b2-3456-7890-abcdef012345",
    "pat cummins":      "d0e1f2a3-b4c5-6789-0123-456789abcdef",
    "shaheen afridi":   "e3f4a5b6-c7d8-9012-3456-789abcdef012",
    "trent boult":      "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
    "kagiso rabada":    "a9b0c1d2-e3f4-5678-9012-3456789abcde",
}

async def fetch_live_stats(player_name: str) -> dict:
    """Fetch live stats — only runs if a real API key is set."""
    if not CRICDATA_API_KEY or CRICDATA_API_KEY == "your_cricdata_api_key_here":
        return {}

    player_id = PLAYER_IDS.get(player_name.lower())
    if not player_id:
        return {}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.cricapi.com/v1/players_info",
                params={"apikey": CRICDATA_API_KEY, "id": player_id}
            )
            data = response.json()
            if data.get("status") == "success":
                return data.get("data", {})
    except Exception as e:
        print(f"CricketData API error for {player_name}: {e}")

    return {}

def build_player_data(name_lower: str, live_data: dict) -> dict:
    """Build full player dict. Live API data takes priority over local fallbacks."""
    context = PLAYER_CONTEXT[name_lower]
    profile = PLAYER_PROFILES[name_lower]
    career = PLAYER_CAREER_STATS[name_lower]

    return {
        "name": live_data.get("name", name_lower.title()),
        "country": live_data.get("country", profile["country"]),
        "role": live_data.get("role", profile["role"]),
        "batting_style": live_data.get("battingStyle", profile["batting_style"]),
        "bowling_style": live_data.get("bowlingStyle", profile["bowling_style"]),
        "career_stats": career,
        "vs_pace": context["vs_pace"],
        "vs_spin": context["vs_spin"],
        "last_10_innings": context["last_10_innings"],
        "icc_ranking": context["icc_ranking"],
        "recent_series": context["recent_series"],
    }

async def get_all_players() -> list:
    """Return summary list of all 20 players."""
    players = []
    for name_lower, context in PLAYER_CONTEXT.items():
        profile = PLAYER_PROFILES[name_lower]
        players.append({
            "name": name_lower.title(),
            "country": profile["country"],
            "role": profile["role"],
            "icc_ranking": context["icc_ranking"],
        })
    return sorted(players, key=lambda x: x["icc_ranking"])

async def get_player(name: str) -> dict | None:
    """Get full player data — cache first, then live API + fallback."""
    name_lower = name.lower().strip()

    if name_lower not in PLAYER_CONTEXT:
        return None

    # Check Redis cache
    cache_key = f"player:{name_lower}"
    cached = await redis_client.get(cache_key)
    if cached:
        print(f"Cache hit: {name_lower}")
        return json.loads(cached)

    # Try live API
    print(f"Cache miss: {name_lower} — fetching")
    live_data = await fetch_live_stats(name_lower)

    # Build merged data
    player_data = build_player_data(name_lower, live_data)

    # Cache for 24 hours
    await redis_client.setex(cache_key, 86400, json.dumps(player_data))

    return player_data

def select_xi(match_type: str, pitch_type: str) -> list:
    """Pick best 11 players based on match type and pitch conditions."""
    player_roles = {
        "virat kohli": "batsman",    "rohit sharma": "batsman",
        "shubman gill": "batsman",   "kl rahul": "batsman",
        "shreyas iyer": "batsman",   "babar azam": "batsman",
        "kane williamson": "batsman","joe root": "batsman",
        "steve smith": "batsman",    "david warner": "batsman",
        "hardik pandya": "allrounder","ravindra jadeja": "allrounder",
        "ben stokes": "allrounder",
        "jasprit bumrah": "bowler",  "mohammed shami": "bowler",
        "kuldeep yadav": "bowler",   "pat cummins": "bowler",
        "shaheen afridi": "bowler",  "trent boult": "bowler",
        "kagiso rabada": "bowler",
    }

    scores = {}
    for name, context in PLAYER_CONTEXT.items():
        score = 0
        role = player_roles.get(name, "batsman")

        if pitch_type.lower() == "pace-friendly":
            score += context["vs_pace"] * 0.6 + context["vs_spin"] * 0.4
            if role == "bowler" and name in [
                "jasprit bumrah", "mohammed shami", "pat cummins",
                "shaheen afridi", "trent boult", "kagiso rabada"
            ]:
                score += 30
        elif pitch_type.lower() == "spin-friendly":
            score += context["vs_spin"] * 0.6 + context["vs_pace"] * 0.4
            if name in ["kuldeep yadav", "ravindra jadeja"]:
                score += 30
        else:
            score += (context["vs_pace"] + context["vs_spin"]) * 0.5

        if role == "allrounder":
            score += 10

        scores[name] = score

    sorted_players = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    xi, batsmen, allrounders, bowlers = [], 0, 0, 0
    for name, score in sorted_players:
        role = player_roles.get(name, "batsman")
        if role == "batsman" and batsmen < 5:
            xi.append(name.title())
            batsmen += 1
        elif role == "allrounder" and allrounders < 2:
            xi.append(name.title())
            allrounders += 1
        elif role == "bowler" and bowlers < 4:
            xi.append(name.title())
            bowlers += 1
        if len(xi) == 11:
            break

    return xi