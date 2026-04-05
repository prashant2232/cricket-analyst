import { useState } from "react";
import { analyzePlayer } from "../services/api";

const sections = [
  { key: "form_summary",  label: "Current Form",      color: "#00ff88" },
  { key: "strengths",     label: "Batting Strengths",  color: "#00aaff" },
  { key: "weaknesses",    label: "Weaknesses",         color: "#ff6644" },
  { key: "prediction",    label: "Match Prediction",   color: "#ffaa00" },
  { key: "verdict",       label: "Analyst Verdict",    color: "#cc88ff" },
];

export default function AnalystReport({ playerName }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyzePlayer({ player_name: playerName });
      setReport(res.data.data);
    } catch (e) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!report && !loading && (
        <button
          onClick={generate}
          style={{
            padding: "12px 28px",
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
          Generate AI Analysis
        </button>
      )}

      {loading && (
        <div style={{ color: "#666", fontSize: 14, padding: "20px 0" }}>
          <span style={{ color: "#00ff88" }}>●</span> Generating analysis...
        </div>
      )}

      {error && (
        <div style={{ color: "#ff4444", fontSize: 14, padding: "12px 0" }}>
          {error}
        </div>
      )}

      {report && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map(({ key, label, color }) => (
            <div key={key} style={{
              background: "#1a1a1a",
              border: `1px solid #222`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 8,
              padding: "14px 16px",
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: color,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}>
                {label}
              </div>
              <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6 }}>
                {report[key]}
              </div>
            </div>
          ))}

          <button
            onClick={() => setReport(null)}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#666",
              fontSize: 12,
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}