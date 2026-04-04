import json

def player_analysis_prompt(player: dict) -> str:
    """Build prompt for single player AI analysis."""
    return f"""
You are an expert cricket analyst with 20 years of experience.
Analyze the following player and return a JSON object only — no markdown, no explanation.

Player Data:
{json.dumps(player, indent=2)}

Return this exact JSON structure:
{{
  "form_summary": "2-3 sentences on current form based on last 10 innings",
  "strengths": "2-3 sentences on batting strengths, shot selection, technique",
  "weaknesses": "2-3 sentences on weaknesses vs pace vs spin with specific numbers",
  "prediction": "1-2 sentences predicting performance in next match",
  "verdict": "1 paragraph analyst verdict written like a cricket commentator"
}}

Rules:
- Use the actual stats provided, reference specific numbers
- vs_pace and vs_spin averages must be mentioned in weaknesses
- last_10_innings scores must inform the form_summary
- Sound like a real cricket analyst, not a chatbot
- Return valid JSON only, no other text
"""

def compare_players_prompt(player1: dict, player2: dict) -> str:
    """Build prompt for head-to-head comparison."""
    return f"""
You are an expert cricket analyst. Compare these two players and return JSON only.

Player 1:
{json.dumps(player1, indent=2)}

Player 2:
{json.dumps(player2, indent=2)}

Return this exact JSON structure:
{{
  "player1_edge": "2-3 sentences on where {player1['name']} has the clear advantage",
  "player2_edge": "2-3 sentences on where {player2['name']} has the clear advantage",
  "combined_analysis": "3-4 sentences comparing both players overall, with a final verdict on who is better and in which format"
}}

Rules:
- Reference specific stats when making claims
- Be balanced but decisive — pick a winner in the combined_analysis
- Return valid JSON only, no other text
"""

def predicted_xi_prompt(players: list, match_type: str, pitch_type: str) -> str:
    """Build prompt for predicted XI with reasoning."""
    player_list = "\n".join([f"- {p}" for p in players])
    return f"""
You are a cricket selector and analyst. Explain why each player was selected for this XI.

Match Type: {match_type}
Pitch Type: {pitch_type}

Selected Players:
{player_list}

Return this exact JSON structure:
{{
  "players": [
    {{"name": "Player Name", "reason": "One sentence explaining exactly why this player was picked for these conditions"}}
  ]
}}

Rules:
- Each reason must mention the match type or pitch conditions specifically
- Reasons should sound like a real selector's explanation
- Return valid JSON only, no other text
- Keep the same player order as provided
"""

def series_report_prompt(player: dict, series_name: str) -> str:
    """Build prompt for series-specific report."""
    series_data = next(
        (s for s in player.get("recent_series", []) if series_name.lower() in s["name"].lower()),
        None
    )
    return f"""
You are a cricket journalist writing a series review.

Player: {player['name']}
Series: {series_name}
Series Data: {json.dumps(series_data, indent=2) if series_data else "Data not available"}
Career Context: {json.dumps(player.get('career_stats', {}), indent=2)}

Return this exact JSON structure:
{{
  "series_report": "3-4 sentences reviewing the player's performance in this series, mentioning specific matches, key innings, and what it means for their form going forward"
}}

Rules:
- Reference the runs and average from series data
- Mention high points and low points of the series
- End with what this means for the player's future selection
- Return valid JSON only, no other text
"""