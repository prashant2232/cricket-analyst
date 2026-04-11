import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getAllPlayers } from "../services/api";
import { T } from "../theme";

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ players: 0 });

  useEffect(() => {
    getAllPlayers()
      .then((res) => setStats({ players: res.data.data.length }))
      .catch(() => {});
  }, []);

  const features = [
    { icon: "📊", title: "Live Stats",    desc: "Real player data with career stats" },
    { icon: "🤖", title: "AI Analysis",   desc: "Gemini Pro generates analyst reports" },
    { icon: "⚔️",  title: "Head-to-Head", desc: "Compare players by role and format" },
    { icon: "🏏",  title: "Pick My XI",   desc: "AI picks best XI for any conditions" },
  ];

  const quickPlayers = [
    "Virat Kohli", "Babar Azam", "Joe Root",
    "Steve Smith", "Jasprit Bumrah", "Ben Stokes",
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 16px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          display: "inline-block", fontSize: 11,
          color: T.gold, letterSpacing: 3,
          textTransform: "uppercase",
          border: `1px solid ${T.navy}`,
          background: T.navy,
          padding: "4px 14px", borderRadius: 20, marginBottom: 20,
        }}>
          AI Powered · {stats.players} Players
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 800,
          color: T.textPrimary, margin: 0,
          lineHeight: 1.1, fontFamily: T.fontSerif,
        }}>
          Cricket<br />
          <span style={{ color: T.gold }}>Performance Analyst</span>
        </h1>
        <p style={{
          color: T.textSecondary, fontSize: 16,
          marginTop: 16, lineHeight: 1.6,
          fontFamily: T.fontSans,
        }}>
          Search any international player for live stats,<br />
          AI-powered analysis and head-to-head comparisons
        </p>
      </div>

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
        <SearchBar />
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 11, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 1,
          marginBottom: 12, textAlign: "center",
        }}>
          Quick search
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {quickPlayers.map((name) => (
            <button key={name}
              onClick={() => navigate(`/player/${encodeURIComponent(name.toLowerCase())}`)}
              style={{
                padding: "7px 14px", background: "transparent",
                border: `1px solid ${T.border}`,
                borderRadius: 20, color: T.textSecondary,
                fontSize: 13, cursor: "pointer",
                fontFamily: T.fontSans, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.color = T.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.textSecondary;
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, marginBottom: 48,
      }}>
        {features.map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderTop: `2px solid ${T.gold}`,
            borderRadius: 12, padding: 16,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <div style={{
              fontSize: 14, fontWeight: 600,
              color: T.textPrimary, marginBottom: 4,
              fontFamily: T.fontSans,
            }}>{title}</div>
            <div style={{
              fontSize: 12, color: T.textSecondary,
              lineHeight: 1.5, fontFamily: T.fontSans,
            }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/compare")} style={{
          padding: "12px 24px", background: "transparent",
          border: `1px solid ${T.gold}`,
          borderRadius: 8, color: T.gold,
          fontSize: 14, cursor: "pointer",
          fontWeight: 500, fontFamily: T.fontSans,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.goldFaint}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          Compare Players →
        </button>
        <button onClick={() => navigate("/pickxi")} style={{
          padding: "12px 24px", background: "transparent",
          border: `1px solid ${T.border}`,
          borderRadius: 8, color: T.textSecondary,
          fontSize: 14, cursor: "pointer",
          fontFamily: T.fontSans,
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = T.textSecondary}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = T.border}
        >
          Pick My XI →
        </button>
      </div>
    </div>
  );
}