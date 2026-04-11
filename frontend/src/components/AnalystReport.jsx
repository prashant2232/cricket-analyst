import { useState } from "react";
import { analyzePlayer } from "../services/api";
import { T } from "../theme";

const sections = [
  { key: "form_summary", label: "Current Form",     color: T.gold },
  { key: "strengths",    label: "Batting Strengths", color: T.info },
  { key: "weaknesses",   label: "Weaknesses",        color: T.bad },
  { key: "prediction",   label: "Match Prediction",  color: T.warn },
  { key: "verdict",      label: "Analyst Verdict",   color: T.purple },
];

export default function AnalystReport({ playerName }) {
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const generate = async () => {
    setLoading(true); setError(null);
    try {
      const res = await analyzePlayer({ player_name: playerName });
      setReport(res.data.data);
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!report && !loading && (
        <button onClick={generate} style={{
          padding: "12px 28px", background: "transparent",
          border: `1px solid ${T.gold}`,
          borderRadius: 8, color: T.gold,
          fontSize: 14, cursor: "pointer", fontWeight: 500,
          fontFamily: T.fontSans,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.goldFaint}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          Generate AI Analysis
        </button>
      )}

      {loading && (
        <div style={{ color: T.textSecondary, fontSize: 14, padding: "20px 0" }}>
          <span style={{ color: T.gold }}>●</span> Generating analysis...
        </div>
      )}

      {error && (
        <div style={{ color: T.bad, fontSize: 14, padding: "12px 0" }}>{error}</div>
      )}

      {report && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map(({ key, label, color }) => (
            <div key={key} style={{
              background: T.bgStat,
              border: `1px solid ${T.border}`,
              borderLeft: `2px solid ${color}`,
              borderRadius: 8, padding: "14px 16px",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: color,
                textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
              }}>{label}</div>
              <div style={{
                color: T.textSecondary, fontSize: 14,
                lineHeight: 1.7, fontFamily: T.fontSans,
              }}>{report[key]}</div>
            </div>
          ))}
          <button onClick={() => setReport(null)} style={{
            padding: "8px 16px", background: "transparent",
            border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.textMuted,
            fontSize: 12, cursor: "pointer", alignSelf: "flex-start",
          }}>
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}