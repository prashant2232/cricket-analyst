import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateXI } from "../services/api";
import PredictedXI from "../components/PredictedXI";

export default function PickXIPage() {
  const navigate = useNavigate();
  const [matchType, setMatchType] = useState("ODI");
  const [pitchType, setPitchType] = useState("neutral");
  const [players, setPlayers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateXI({ match_type: matchType, pitch_type: pitchType });
      setPlayers(res.data.data.players);
    } catch (e) {
      setError("Failed to generate XI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    padding: "10px 14px",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px",
      maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate("/")} style={{
        background: "transparent", border: "none",
        color: "#666", cursor: "pointer",
        fontSize: 14, marginBottom: 20, padding: 0,
      }}>
        ← Back
      </button>

      <div style={{ fontSize: 24, fontWeight: 700,
        color: "#fff", marginBottom: 6 }}>
        Pick My XI
      </div>
      <div style={{ fontSize: 14, color: "#555", marginBottom: 24 }}>
        AI selects the best XI based on conditions
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12,
        marginBottom: 24, flexWrap: "wrap" }}>
        <select value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
          style={selectStyle}>
          <option value="Test">Test</option>
          <option value="ODI">ODI</option>
          <option value="T20">T20</option>
        </select>

        <select value={pitchType}
          onChange={(e) => setPitchType(e.target.value)}
          style={selectStyle}>
          <option value="neutral">Neutral Pitch</option>
          <option value="pace-friendly">Pace Friendly</option>
          <option value="spin-friendly">Spin Friendly</option>
        </select>

        <button onClick={handleGenerate} style={{
          padding: "10px 24px",
          background: "transparent",
          border: "1px solid #00ff88",
          borderRadius: 8,
          color: "#00ff88",
          fontSize: 14,
          cursor: "pointer",
          fontWeight: 500,
        }}>
          {loading ? "Picking..." : "Pick My XI"}
        </button>
      </div>

      {error && (
        <div style={{ color: "#ff4444", fontSize: 14,
          marginBottom: 16 }}>
          {error}
        </div>
      )}

      {players && <PredictedXI players={players} />}
    </div>
  );
}