import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getAllPlayers } from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ players: 0 });

  useEffect(() => {
    getAllPlayers()
      .then((res) => setStats({ players: res.data.data.length }))
      .catch(() => {});
  }, []);

  const features = [
    { icon: "📊", title: "Live Stats",     desc: "Real player data with career stats" },
    { icon: "🤖", title: "AI Analysis",    desc: "Gemini Pro generates analyst reports" },
    { icon: "⚔️",  title: "Head-to-Head",  desc: "Compare players by role and format" },
    { icon: "🏏",  title: "Pick My XI",    desc: "AI picks best XI for any conditions" },
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
          display: "inline-block",
          fontSize: 11, color: "#00ff88",
          letterSpacing: 3, textTransform: "uppercase",
          border: "1px solid #0a2a1a",
          background: "#0a2a1a",
          padding: "4px 14px", borderRadius: 20,
          marginBottom: 20,
        }}>
          AI Powered · {stats.players} Players
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 800,
          color: "#fff", margin: 0, lineHeight: 1.1,
        }}>
          Cricket<br />
          <span style={{ color: "#00ff88" }}>Performance Analyst</span>
        </h1>
        <p style={{
          color: "#555", fontSize: 16,
          marginTop: 16, lineHeight: 1.6,
        }}>
          Search any international player for live stats,<br />
          AI-powered analysis and head-to-head comparisons
        </p>
      </div>

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "center",
        marginBottom: 48 }}>
        <SearchBar />
      </div>

      {/* Quick player links */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase",
          letterSpacing: 1, marginBottom: 12, textAlign: "center" }}>
          Quick search
        </div>
        <div style={{ display: "flex", gap: 8,
          flexWrap: "wrap", justifyContent: "center" }}>
          {quickPlayers.map((name) => (
            <button
              key={name}
              onClick={() => navigate(`/player/${encodeURIComponent(name.toLowerCase())}`)}
              style={{
                padding: "7px 14px",
                background: "transparent",
                border: "1px solid #222",
                borderRadius: 20,
                color: "#666",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00ff88";
                e.currentTarget.style.color = "#00ff88";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.color = "#666";
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
        gap: 12,
        marginBottom: 48,
      }}>
        {features.map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: "#1a1a1a",
            border: "1px solid #222",
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600,
              color: "#fff", marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: "#555",
              lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: 12,
        justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/compare")}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: "1px solid #00ff88",
            borderRadius: 8,
            color: "#00ff88",
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#0a2a1a"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          Compare Players →
        </button>
        <button
          onClick={() => navigate("/pickxi")}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: "1px solid #333",
            borderRadius: 8,
            color: "#888",
            fontSize: 14,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "#666"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "#333"}
        >
          Pick My XI →
        </button>
      </div>

    </div>
  );
}