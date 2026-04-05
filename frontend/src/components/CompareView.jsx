import { useState, useEffect, useRef } from "react";
import { getAllPlayers, getPlayer, comparePlayers } from "../services/api";
import PlayerRadarChart from "./RadarChart";

const battingMetrics = [
  { label: "Matches",     key: "matches",      path: "career_stats" },
  { label: "Runs",        key: "runs",          path: "career_stats" },
  { label: "Average",     key: "average",       path: "career_stats" },
  { label: "Strike Rate", key: "strike_rate",   path: "career_stats" },
  { label: "100s",        key: "hundreds",      path: "career_stats" },
  { label: "50s",         key: "fifties",       path: "career_stats" },
  { label: "vs Pace",     key: "vs_pace",       path: "root" },
  { label: "vs Spin",     key: "vs_spin",       path: "root" },
];

const bowlingMetrics = [
  { label: "Wickets",     key: "wickets",       path: "bowling_stats" },
  { label: "Average",     key: "average",       path: "bowling_stats" },
  { label: "Economy",     key: "economy",       path: "bowling_stats" },
  { label: "Strike Rate", key: "strike_rate",   path: "bowling_stats" },
  { label: "5-Wickets",   key: "five_wickets",  path: "bowling_stats" },
  { label: "Best",        key: "best",          path: "bowling_stats" },
];

function getValue(player, metric) {
  if (metric.path === "root") return player[metric.key];
  if (metric.path === "bowling_stats") return player.bowling_stats?.[metric.key] ?? "N/A";
  return player[metric.path][metric.key];
}

// Reusable autocomplete input
function PlayerSearchInput({ label, value, onChange, onSelect, allPlayers, filterRole }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const ref = useRef();

  useEffect(() => {
    if (value.trim().length < 2) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }
    const results = allPlayers.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(value.toLowerCase());
      const matchesRole = filterRole ? p.role.toLowerCase() === filterRole.toLowerCase() : true;
      return matchesName && matchesRole;
    });
    setFiltered(results);
    setShowDropdown(true);
  }, [value, allPlayers, filterRole]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ flex: 1, position: "relative" }}>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 6,
        textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type player name..."
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          color: "#fff",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          marginTop: 4,
          zIndex: 100,
          overflow: "hidden",
        }}>
          {filtered.map((player) => (
            <div
              key={player.name}
              onClick={() => {
                onSelect(player);
                setShowDropdown(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #222",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#252525"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: "#fff", fontSize: 13 }}>{player.name}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 11, padding: "2px 7px",
                  borderRadius: 20, background: "#252525", color: "#888" }}>
                  {player.country}
                </span>
                <span style={{ fontSize: 11, padding: "2px 7px",
                  borderRadius: 20, background: "#1a2a1a", color: "#00ff88" }}>
                  {player.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showDropdown && filtered.length === 0 && value.length >= 2 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#1a1a1a", border: "1px solid #333",
          borderRadius: 8, marginTop: 4, padding: "12px 14px",
          color: "#666", fontSize: 13, zIndex: 100,
        }}>
          {filterRole
            ? `No ${filterRole}s found matching "${value}"`
            : `No players found`}
        </div>
      )}
    </div>
  );
}

export default function CompareView() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compareMode, setCompareMode] = useState("Batsman");

  // Fetch all players once for autocomplete
  useEffect(() => {
    getAllPlayers()
      .then((res) => setAllPlayers(res.data.data))
      .catch((err) => console.error("Failed to load players:", err));
  }, []);

  const handleSelect1 = async (player) => {
    setName1(player.name);
    setPlayer1(null);
    setPlayer2(null);
    setReport(null);
    setError(null);
    try {
      const res = await getPlayer(player.name.toLowerCase());
      setPlayer1(res.data.data);
    } catch {
      setError("Failed to load player 1.");
    }
  };

  const handleSelect2 = async (player) => {
    setName2(player.name);
    setPlayer2(null);
    setReport(null);
    setError(null);
    try {
      const res = await getPlayer(player.name.toLowerCase());
      setPlayer2(res.data.data);
    } catch {
      setError("Failed to load player 2.");
    }
  };

  const fetchAI = async () => {
    setAiLoading(true);
    try {
      const res = await comparePlayers({
        player1: name1.toLowerCase().trim(),
        player2: name2.toLowerCase().trim(),
      });
      setReport(res.data.data);
    } catch {
      setError("AI comparison failed.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      {/* Compare mode selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 8,
          textTransform: "uppercase", letterSpacing: 1 }}>
          Compare by role
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Batsman", "Allrounder", "Bowler"].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setCompareMode(mode);
                setName1("");
                setName2("");
                setPlayer1(null);
                setPlayer2(null);
                setReport(null);
                setError(null);
              }}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: compareMode === mode ? "#00ff88" : "#333",
                background: compareMode === mode ? "#0a2a1a" : "transparent",
                color: compareMode === mode ? "#00ff88" : "#666",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {mode}s
            </button>
          ))}
        </div>
      </div>

      {/* Player search inputs */}
      <div style={{ display: "flex", gap: 16,
        marginBottom: 20, flexWrap: "wrap" }}>
        <PlayerSearchInput
          label="Player 1"
          value={name1}
          onChange={(v) => { setName1(v); setPlayer1(null); }}
          onSelect={handleSelect1}
          allPlayers={allPlayers}
          filterRole={compareMode}
        />
        <PlayerSearchInput
          label="Player 2"
          value={name2}
          onChange={(v) => { setName2(v); setPlayer2(null); }}
          onSelect={handleSelect2}
          allPlayers={allPlayers}
          filterRole={compareMode}
        />
      </div>

      {error && (
        <div style={{ color: "#ff4444", fontSize: 14, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ color: "#666", fontSize: 14 }}>Loading...</div>
      )}

      {player1 && player2 && (
        <>
          {/* Stat comparison table */}
          <div style={{
            background: "#1a1a1a",
            border: "1px solid #222",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 20,
          }}>
            {/* Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 1fr",
              padding: "14px 16px",
              borderBottom: "1px solid #222",
              background: "#111",
            }}>
              <div style={{ color: "#00ff88", fontWeight: 600, fontSize: 14 }}>
                {player1.name}
              </div>
              <div style={{ color: "#444", fontSize: 12, textAlign: "center" }}>
                STAT
              </div>
              <div style={{ color: "#00aaff", fontWeight: 600,
                fontSize: 14, textAlign: "right" }}>
                {player2.name}
              </div>
            </div>

            {/* Metric rows */}
            {/* Metric rows */}
{compareMode === "Allrounder" ? (
  <>
    {/* Batting section */}
    <div style={{ padding: "8px 16px", background: "#0d0d0d",
      fontSize: 10, color: "#444", textTransform: "uppercase",
      letterSpacing: 1 }}>
      Batting
    </div>
    {battingMetrics.map((metric) => {
      const v1 = getValue(player1, metric);
      const v2 = getValue(player2, metric);
      const p1Wins = v1 > v2;
      const p2Wins = v2 > v1;
      return (
        <div key={metric.key} style={{
          display: "grid", gridTemplateColumns: "1fr 120px 1fr",
          padding: "10px 16px", borderBottom: "1px solid #111",
          alignItems: "center",
        }}>
          <div style={{ fontSize: 15, fontWeight: 500,
            color: p1Wins ? "#00ff88" : "#555" }}>{v1}</div>
          <div style={{ color: "#444", fontSize: 11,
            textAlign: "center" }}>{metric.label}</div>
          <div style={{ fontSize: 15, fontWeight: 500,
            color: p2Wins ? "#00aaff" : "#555",
            textAlign: "right" }}>{v2}</div>
        </div>
      );
    })}
    {/* Bowling section */}
    <div style={{ padding: "8px 16px", background: "#0d0d0d",
      fontSize: 10, color: "#444", textTransform: "uppercase",
      letterSpacing: 1 }}>
      Bowling
    </div>
    {bowlingMetrics.map((metric) => {
      const v1 = getValue(player1, metric);
      const v2 = getValue(player2, metric);
      const v1Num = parseFloat(v1);
      const v2Num = parseFloat(v2);
      const lowerIsBetter = ["average", "economy", "strike_rate"].includes(metric.key);
      const p1Wins = lowerIsBetter ? v1Num < v2Num : v1Num > v2Num;
      const p2Wins = lowerIsBetter ? v2Num < v1Num : v2Num > v1Num;
      return (
        <div key={metric.key} style={{
          display: "grid", gridTemplateColumns: "1fr 120px 1fr",
          padding: "10px 16px", borderBottom: "1px solid #111",
          alignItems: "center",
        }}>
          <div style={{ fontSize: 15, fontWeight: 500,
            color: p1Wins ? "#00ff88" : "#555" }}>{v1}</div>
          <div style={{ color: "#444", fontSize: 11,
            textAlign: "center" }}>{metric.label}</div>
          <div style={{ fontSize: 15, fontWeight: 500,
            color: p2Wins ? "#00aaff" : "#555",
            textAlign: "right" }}>{v2}</div>
        </div>
      );
    })}
  </>
) : compareMode === "Bowler" ? (
  bowlingMetrics.map((metric) => {
    const v1 = getValue(player1, metric);
    const v2 = getValue(player2, metric);
    const v1Num = parseFloat(v1);
    const v2Num = parseFloat(v2);
    const lowerIsBetter = ["average", "economy", "strike_rate"].includes(metric.key);
    const p1Wins = lowerIsBetter ? v1Num < v2Num : v1Num > v2Num;
    const p2Wins = lowerIsBetter ? v2Num < v1Num : v2Num > v1Num;
    return (
      <div key={metric.key} style={{
        display: "grid", gridTemplateColumns: "1fr 120px 1fr",
        padding: "10px 16px", borderBottom: "1px solid #111",
        alignItems: "center",
      }}>
        <div style={{ fontSize: 15, fontWeight: 500,
          color: p1Wins ? "#00ff88" : "#555" }}>{v1}</div>
        <div style={{ color: "#444", fontSize: 11,
          textAlign: "center" }}>{metric.label}</div>
        <div style={{ fontSize: 15, fontWeight: 500,
          color: p2Wins ? "#00aaff" : "#555",
          textAlign: "right" }}>{v2}</div>
      </div>
    );
  })
) : (
  battingMetrics.map((metric) => {
    const v1 = getValue(player1, metric);
    const v2 = getValue(player2, metric);
    const p1Wins = v1 > v2;
    const p2Wins = v2 > v1;
    return (
      <div key={metric.key} style={{
        display: "grid", gridTemplateColumns: "1fr 120px 1fr",
        padding: "10px 16px", borderBottom: "1px solid #111",
        alignItems: "center",
      }}>
        <div style={{ fontSize: 15, fontWeight: 500,
          color: p1Wins ? "#00ff88" : "#555" }}>{v1}</div>
        <div style={{ color: "#444", fontSize: 11,
          textAlign: "center" }}>{metric.label}</div>
        <div style={{ fontSize: 15, fontWeight: 500,
          color: p2Wins ? "#00aaff" : "#555",
          textAlign: "right" }}>{v2}</div>
      </div>
    );
  })
)}
          </div>

          {/* Radar Chart */}
          <div style={{
            background: "#1a1a1a", border: "1px solid #222",
            borderRadius: 12, padding: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, color: "#555",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              Performance Radar
            </div>
            <PlayerRadarChart player1={player1} player2={player2} />
          </div>

          {/* AI Comparison */}
          <div style={{
            background: "#1a1a1a", border: "1px solid #222",
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ fontSize: 12, color: "#555",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
              AI Comparison Report
            </div>

            {!report && !aiLoading && (
              <button onClick={fetchAI} style={{
                padding: "10px 20px", background: "transparent",
                border: "1px solid #00ff88", borderRadius: 8,
                color: "#00ff88", fontSize: 14, cursor: "pointer",
              }}>
                Generate AI Comparison
              </button>
            )}

            {aiLoading && (
              <div style={{ color: "#666", fontSize: 14 }}>
                <span style={{ color: "#00ff88" }}>●</span> Generating...
              </div>
            )}

            {report && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: player1.name + " Edge", value: report.player1_edge,     color: "#00ff88" },
                  { label: player2.name + " Edge", value: report.player2_edge,     color: "#00aaff" },
                  { label: "Combined Analysis",    value: report.combined_analysis, color: "#ffaa00" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    background: "#111",
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 8,
                    padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 11, color: color,
                      textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                      {label}
                    </div>
                    <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6 }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Waiting for second player */}
      {player1 && !player2 && (
        <div style={{ color: "#555", fontSize: 14, padding: "20px 0" }}>
          Now select Player 2 to see the comparison
        </div>
      )}
    </div>
  );
}