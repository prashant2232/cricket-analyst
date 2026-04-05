import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayer } from "../services/api";
import PlayerCard from "../components/PlayerCard";
import FormChart from "../components/FormChart";
import AnalystReport from "../components/AnalystReport";
import { PlayerCardSkeleton } from "../components/Skeleton";

export default function PlayerPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const decoded = decodeURIComponent(name).toLowerCase().trim();
    getPlayer(decoded)
      .then((res) => setPlayer(res.data.data))
      .catch(() => setError("Player not found"))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      <PlayerCardSkeleton />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "60vh", display: "flex",
      flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🏏</div>
      <div style={{ color: "#ff4444", fontSize: 18 }}>{error}</div>
      <button onClick={() => navigate("/")} style={{
        padding: "10px 20px", background: "transparent",
        border: "1px solid #333", borderRadius: 8,
        color: "#888", cursor: "pointer", fontSize: 14,
      }}>
        Back to Home
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      <PlayerCard player={player} />

      <div style={{ marginTop: 24, background: "#1a1a1a",
        border: "1px solid #222", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#555", textTransform: "uppercase",
          letterSpacing: 1, marginBottom: 16 }}>
          Last 10 Innings Form
        </div>
        <FormChart
          innings={player.last_10_innings}
          average={player.career_stats.average}
        />
      </div>

      <div style={{ marginTop: 24, background: "#1a1a1a",
        border: "1px solid #222", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#555", textTransform: "uppercase",
          letterSpacing: 1, marginBottom: 16 }}>
          Recent Series
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {player.recent_series.map((series, i) => (
            <div key={i} style={{
              background: "#111", borderRadius: 8, padding: "12px 14px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, color: "#ddd" }}>{series.name}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                  {series.matches} matches
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 600,
                  color: "#00ff88" }}>{series.runs}</div>
                <div style={{ fontSize: 11, color: "#555" }}>
                  avg {series.average}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, background: "#1a1a1a",
        border: "1px solid #222", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#555", textTransform: "uppercase",
          letterSpacing: 1, marginBottom: 16 }}>
          AI Analyst Report
        </div>
        <AnalystReport playerName={player.name} />
      </div>
    </div>
  );
}