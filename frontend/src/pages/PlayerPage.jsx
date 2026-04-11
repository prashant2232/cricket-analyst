import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayer } from "../services/api";
import PlayerCard from "../components/PlayerCard";
import FormChart from "../components/FormChart";
import AnalystReport from "../components/AnalystReport";
import { PlayerCardSkeleton } from "../components/Skeleton";
import { T } from "../theme";

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
    <div style={{
      minHeight: "60vh", display: "flex",
      flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🏏</div>
      <div style={{ color: T.bad, fontSize: 18, fontFamily: T.fontSans }}>{error}</div>
      <button onClick={() => navigate("/")} style={{
        padding: "10px 20px", background: "transparent",
        border: `1px solid ${T.border}`,
        borderRadius: 8, color: T.textSecondary,
        cursor: "pointer", fontSize: 14,
        fontFamily: T.fontSans,
      }}>
        Back to Home
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>

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

      {/* Player Card */}
      <PlayerCard player={player} />

      {/* Form Chart */}
      <div style={{
        marginTop: 24, background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${T.gold}`,
        borderRadius: 12, padding: 20,
      }}>
        <div style={{
          fontSize: 11, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 1.5,
          marginBottom: 16, fontFamily: T.fontSans,
        }}>
          Last 10 Innings Form
        </div>
        <FormChart
          innings={player.last_10_innings}
          average={player.career_stats.average}
        />
      </div>

      {/* Recent Series */}
      <div style={{
        marginTop: 24, background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${T.gold}`,
        borderRadius: 12, padding: 20,
      }}>
        <div style={{
          fontSize: 11, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 1.5,
          marginBottom: 16, fontFamily: T.fontSans,
        }}>
          Recent Series
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {player.recent_series.map((series, i) => (
            <div key={i} style={{
              background: T.bgStat,
              border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "12px 14px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{
                  fontSize: 13, color: T.textPrimary,
                  fontFamily: T.fontSans,
                }}>
                  {series.name}
                </div>
                <div style={{
                  fontSize: 11, color: T.textMuted,
                  marginTop: 2, fontFamily: T.fontSans,
                }}>
                  {series.matches} matches
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize: 18, fontWeight: 700,
                  color: T.gold, fontFamily: T.fontSans,
                }}>
                  {series.runs}
                </div>
                <div style={{
                  fontSize: 11, color: T.textMuted,
                  fontFamily: T.fontSans,
                }}>
                  avg {series.average}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analyst Report */}
      <div style={{
        marginTop: 24, background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${T.gold}`,
        borderRadius: 12, padding: 20,
      }}>
        <div style={{
          fontSize: 11, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 1.5,
          marginBottom: 16, fontFamily: T.fontSans,
        }}>
          AI Analyst Report
        </div>
        <AnalystReport playerName={player.name} />
      </div>

    </div>
  );
}