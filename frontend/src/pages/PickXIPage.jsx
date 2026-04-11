import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateXI } from "../services/api";
import { T } from "../theme";

function PredictedXI({ players }) {
  const bowlers     = players.slice(7, 11);
  const allrounders = players.slice(5, 7);
  const batsmen     = players.slice(1, 5);
  const keeper      = players.slice(0, 1);

  const PlayerBadge = ({ player }) => (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 4,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: T.navy, border: `2px solid ${T.gold}`,
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 11,
        fontWeight: 700, color: T.gold,
      }}>
        {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </div>
      <div style={{
        fontSize: 10, color: T.textSecondary,
        textAlign: "center", maxWidth: 64,
        lineHeight: 1.3, fontFamily: T.fontSans,
      }}>
        {player.name.split(" ").slice(-1)[0]}
      </div>
    </div>
  );

  const Row = ({ group }) => (
    <div style={{
      display: "flex", justifyContent: "center",
      gap: 16, flexWrap: "wrap",
    }}>
      {group.map((p, i) => <PlayerBadge key={i} player={p} />)}
    </div>
  );

  return (
    <div>
      {/* Cricket field oval */}
      <div style={{
        background: "#0a1f0a",
        border: "2px solid #1a3a1a",
        borderRadius: "50%", width: "100%",
        maxWidth: 380, aspectRatio: "1",
        margin: "0 auto 24px",
        display: "flex", flexDirection: "column",
        justifyContent: "space-around",
        padding: "28px 16px", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 28, height: 110,
          background: "#1a3a0a", borderRadius: 4,
          border: "1px solid #2a5a1a",
        }} />
        <Row group={bowlers} />
        <Row group={allrounders} />
        <Row group={batsmen} />
        <Row group={keeper} />
      </div>

      {/* Player list with AI reasons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {players.map((player, i) => (
          <div key={i} style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "12px 14px",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: T.goldFaint,
              border: `1px solid ${T.goldBorder}`,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 11,
              color: T.gold, fontWeight: 700, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div>
              <div style={{
                fontSize: 14, color: T.textPrimary,
                fontWeight: 600, marginBottom: 3,
                fontFamily: T.fontSans,
              }}>
                {player.name}
              </div>
              <div style={{
                fontSize: 12, color: T.textSecondary,
                lineHeight: 1.5, fontFamily: T.fontSans,
              }}>
                {player.reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PickXIPage() {
  const navigate    = useNavigate();
  const [matchType, setMatchType] = useState("ODI");
  const [pitchType, setPitchType] = useState("neutral");
  const [players,   setPlayers]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateXI({ match_type: matchType, pitch_type: pitchType });
      setPlayers(res.data.data.players);
    } catch {
      setError("Failed to generate XI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    padding: "10px 14px",
    background: T.bgInput,
    border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.textPrimary,
    fontSize: 14, outline: "none",
    cursor: "pointer", fontFamily: T.fontSans,
  };

  return (
    <div style={{
      minHeight: "100vh", padding: "24px 16px",
      maxWidth: 800, margin: "0 auto",
    }}>

      {/* Back button */}
      <button onClick={() => navigate("/")} style={{
        background: "transparent", border: "none",
        color: T.textMuted, cursor: "pointer",
        fontSize: 14, marginBottom: 20, padding: 0,
        fontFamily: T.fontSans,
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = T.gold}
      onMouseLeave={(e) => e.currentTarget.style.color = T.textMuted}
      >
        ← Back
      </button>

      {/* Page header */}
      <div style={{
        fontSize: 28, fontWeight: 800,
        color: T.textPrimary, marginBottom: 6,
        fontFamily: T.fontSerif,
      }}>
        Pick My XI
      </div>
      <div style={{
        fontSize: 14, color: T.textSecondary,
        marginBottom: 24, fontFamily: T.fontSans,
      }}>
        AI selects the best XI based on match conditions
      </div>

      {/* Controls */}
      <div style={{
        display: "flex", gap: 12,
        marginBottom: 24, flexWrap: "wrap",
      }}>
        <select
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
          style={selectStyle}
        >
          <option value="Test">Test</option>
          <option value="ODI">ODI</option>
          <option value="T20">T20</option>
        </select>

        <select
          value={pitchType}
          onChange={(e) => setPitchType(e.target.value)}
          style={selectStyle}
        >
          <option value="neutral">Neutral Pitch</option>
          <option value="pace-friendly">Pace Friendly</option>
          <option value="spin-friendly">Spin Friendly</option>
        </select>

        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 24px", background: "transparent",
            border: `1px solid ${T.gold}`,
            borderRadius: 8, color: T.gold,
            fontSize: 14, cursor: "pointer",
            fontWeight: 500, fontFamily: T.fontSans,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.goldFaint}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          {loading ? "Picking..." : "Pick My XI"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          color: T.bad, fontSize: 14,
          marginBottom: 16, fontFamily: T.fontSans,
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          color: T.textSecondary, fontSize: 14,
          padding: "20px 0", fontFamily: T.fontSans,
        }}>
          <span style={{ color: T.gold }}>●</span> AI is selecting the best XI...
        </div>
      )}

      {/* Results */}
      {players && (
        <div style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderTop: `2px solid ${T.gold}`,
          borderRadius: 12, padding: 20,
        }}>
          <div style={{
            fontSize: 10, color: T.textMuted,
            textTransform: "uppercase", letterSpacing: 1.5,
            marginBottom: 20, fontFamily: T.fontSans,
          }}>
            {matchType} · {pitchType} pitch
          </div>
          <PredictedXI players={players} />
        </div>
      )}
    </div>
  );
}