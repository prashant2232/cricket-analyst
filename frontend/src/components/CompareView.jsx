import { useState, useEffect, useRef } from "react";
import { getAllPlayers, getPlayer, comparePlayers } from "../services/api";
import PlayerRadarChart from "./RadarChart";
import { T } from "../theme";

const battingMetrics = [
  { label: "Matches",     key: "matches",     path: "career_stats" },
  { label: "Runs",        key: "runs",         path: "career_stats" },
  { label: "Average",     key: "average",      path: "career_stats" },
  { label: "Strike Rate", key: "strike_rate",  path: "career_stats" },
  { label: "100s",        key: "hundreds",     path: "career_stats" },
  { label: "50s",         key: "fifties",      path: "career_stats" },
  { label: "vs Pace",     key: "vs_pace",      path: "root" },
  { label: "vs Spin",     key: "vs_spin",      path: "root" },
];

const bowlingMetrics = [
  { label: "Wickets",     key: "wickets",      path: "bowling_stats" },
  { label: "Average",     key: "average",      path: "bowling_stats" },
  { label: "Economy",     key: "economy",      path: "bowling_stats" },
  { label: "Strike Rate", key: "strike_rate",  path: "bowling_stats" },
  { label: "5-Wickets",   key: "five_wickets", path: "bowling_stats" },
  { label: "Best",        key: "best",         path: "bowling_stats" },
];

function getValue(player, metric) {
  if (metric.path === "root") return player[metric.key];
  if (metric.path === "bowling_stats") return player.bowling_stats?.[metric.key] ?? "N/A";
  return player[metric.path][metric.key];
}

function PlayerSearchInput({ label, value, onChange, onSelect, allPlayers, filterRole }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered]         = useState([]);
  const ref = useRef();

  useEffect(() => {
    if (value.trim().length < 2) { setFiltered([]); setShowDropdown(false); return; }
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
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ flex: 1, position: "relative" }}>
      <div style={{
        fontSize: 10, color: T.textMuted, marginBottom: 6,
        textTransform: "uppercase", letterSpacing: 1.5,
        fontFamily: T.fontSans,
      }}>
        {label}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: T.bgInput, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "10px 14px",
      }}>
        <span style={{ color: T.textMuted, fontSize: 14 }}>⌕</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type player name..."
          style={{
            flex: 1, background: "transparent",
            border: "none", outline: "none",
            color: T.textPrimary, fontSize: 14,
            fontFamily: T.fontSans,
          }}
        />
      </div>

      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: T.bgNav, border: `1px solid ${T.border}`,
          borderRadius: 8, marginTop: 4, zIndex: 100, overflow: "hidden",
        }}>
          {filtered.map((player) => (
            <div key={player.name}
              onClick={() => { onSelect(player); setShowDropdown(false); }}
              style={{
                padding: "10px 14px", cursor: "pointer",
                borderBottom: `1px solid ${T.border}`,
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.navy}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: T.textPrimary, fontSize: 13,
                fontFamily: T.fontSans }}>{player.name}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{
                  fontSize: 11, padding: "2px 7px", borderRadius: 4,
                  background: T.navy, color: T.textSecondary,
                }}>{player.country}</span>
                <span style={{
                  fontSize: 11, padding: "2px 7px", borderRadius: 4,
                  background: T.goldFaint, color: T.gold,
                  border: `1px solid ${T.goldBorder}`,
                }}>{player.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && filtered.length === 0 && value.length >= 2 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: T.bgNav, border: `1px solid ${T.border}`,
          borderRadius: 8, marginTop: 4, padding: "12px 14px",
          color: T.textMuted, fontSize: 13, zIndex: 100,
          fontFamily: T.fontSans,
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
  const [allPlayers,   setAllPlayers]   = useState([]);
  const [name1,        setName1]        = useState("");
  const [name2,        setName2]        = useState("");
  const [player1,      setPlayer1]      = useState(null);
  const [player2,      setPlayer2]      = useState(null);
  const [report,       setReport]       = useState(null);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [error,        setError]        = useState(null);
  const [compareMode,  setCompareMode]  = useState("Batsman");

  useEffect(() => {
    getAllPlayers()
      .then((res) => setAllPlayers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect1 = async (player) => {
    setName1(player.name);
    setPlayer1(null); setPlayer2(null); setReport(null); setError(null);
    try {
      const res = await getPlayer(player.name.toLowerCase());
      setPlayer1(res.data.data);
    } catch { setError("Failed to load player 1."); }
  };

  const handleSelect2 = async (player) => {
    setName2(player.name);
    setPlayer2(null); setReport(null); setError(null);
    try {
      const res = await getPlayer(player.name.toLowerCase());
      setPlayer2(res.data.data);
    } catch { setError("Failed to load player 2."); }
  };

  const fetchAI = async () => {
    setAiLoading(true);
    try {
      const res = await comparePlayers({
        player1: name1.toLowerCase().trim(),
        player2: name2.toLowerCase().trim(),
      });
      setReport(res.data.data);
    } catch { setError("AI comparison failed."); }
    finally { setAiLoading(false); }
  };

  const MetricRow = ({ metric, p1, p2 }) => {
    const v1 = getValue(p1, metric);
    const v2 = getValue(p2, metric);
    const v1Num = parseFloat(v1);
    const v2Num = parseFloat(v2);
    const lowerIsBetter = ["average", "economy", "strike_rate"].includes(metric.key)
      && metric.path === "bowling_stats";
    const p1Wins = lowerIsBetter ? v1Num < v2Num : v1Num > v2Num;
    const p2Wins = lowerIsBetter ? v2Num < v1Num : v2Num > v1Num;

    return (
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 110px 1fr",
        padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
        alignItems: "center",
      }}>
        <div style={{
          fontSize: 15, fontWeight: 600,
          color: p1Wins ? T.gold : T.textMuted,
          fontFamily: T.fontSans,
        }}>{v1}</div>
        <div style={{
          fontSize: 10, color: T.textMuted,
          textAlign: "center", textTransform: "uppercase",
          letterSpacing: 1, fontFamily: T.fontSans,
        }}>{metric.label}</div>
        <div style={{
          fontSize: 15, fontWeight: 600,
          color: p2Wins ? T.info : T.textMuted,
          textAlign: "right", fontFamily: T.fontSans,
        }}>{v2}</div>
      </div>
    );
  };

  const SectionDivider = ({ text }) => (
    <div style={{
      padding: "7px 16px",
      background: T.bgStat,
      fontSize: 10, color: T.textMuted,
      textTransform: "uppercase", letterSpacing: 1.5,
      fontFamily: T.fontSans,
      borderBottom: `1px solid ${T.border}`,
    }}>
      {text}
    </div>
  );

  return (
    <div>
      {/* Role mode selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 10, color: T.textMuted, marginBottom: 8,
          textTransform: "uppercase", letterSpacing: 1.5,
          fontFamily: T.fontSans,
        }}>
          Compare by role
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Batsman", "Allrounder", "Bowler"].map((mode) => (
            <button key={mode}
              onClick={() => {
                setCompareMode(mode);
                setName1(""); setName2("");
                setPlayer1(null); setPlayer2(null);
                setReport(null); setError(null);
              }}
              style={{
                padding: "7px 16px", borderRadius: 20,
                border: `1px solid ${compareMode === mode ? T.gold : T.border}`,
                background: compareMode === mode ? T.goldFaint : "transparent",
                color: compareMode === mode ? T.gold : T.textSecondary,
                fontSize: 13, cursor: "pointer",
                fontFamily: T.fontSans, transition: "all 0.2s",
              }}
            >
              {mode}s
            </button>
          ))}
        </div>
      </div>

      {/* Search inputs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
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
        <div style={{
          color: T.bad, fontSize: 14,
          marginBottom: 12, fontFamily: T.fontSans,
        }}>{error}</div>
      )}

      {player1 && !player2 && (
        <div style={{
          color: T.textMuted, fontSize: 14,
          padding: "20px 0", fontFamily: T.fontSans,
        }}>
          Now select Player 2 to see the comparison
        </div>
      )}

      {player1 && player2 && (
        <>
          {/* Stat comparison table */}
          <div style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderTop: `2px solid ${T.gold}`,
            borderRadius: 12, overflow: "hidden", marginBottom: 20,
          }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 110px 1fr",
              padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
              background: T.bgStat,
            }}>
              <div style={{
                color: T.gold, fontWeight: 700, fontSize: 14,
                fontFamily: T.fontSans,
              }}>{player1.name}</div>
              <div style={{
                color: T.textMuted, fontSize: 10,
                textAlign: "center", textTransform: "uppercase",
                letterSpacing: 1, fontFamily: T.fontSans,
              }}>Stat</div>
              <div style={{
                color: T.info, fontWeight: 700, fontSize: 14,
                textAlign: "right", fontFamily: T.fontSans,
              }}>{player2.name}</div>
            </div>

            {/* Metric rows based on mode */}
            {compareMode === "Allrounder" ? (
              <>
                <SectionDivider text="Batting" />
                {battingMetrics.map((m) => (
                  <MetricRow key={m.key} metric={m} p1={player1} p2={player2} />
                ))}
                <SectionDivider text="Bowling" />
                {bowlingMetrics.map((m) => (
                  <MetricRow key={m.key} metric={m} p1={player1} p2={player2} />
                ))}
              </>
            ) : compareMode === "Bowler" ? (
              bowlingMetrics.map((m) => (
                <MetricRow key={m.key} metric={m} p1={player1} p2={player2} />
              ))
            ) : (
              battingMetrics.map((m) => (
                <MetricRow key={m.key} metric={m} p1={player1} p2={player2} />
              ))
            )}
          </div>

          {/* Radar Chart */}
          <div style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderTop: `2px solid ${T.gold}`,
            borderRadius: 12, padding: 20, marginBottom: 20,
          }}>
            <div style={{
              fontSize: 10, color: T.textMuted,
              textTransform: "uppercase", letterSpacing: 1.5,
              marginBottom: 12, fontFamily: T.fontSans,
            }}>
              Performance Radar
            </div>
            <PlayerRadarChart player1={player1} player2={player2} />
          </div>

          {/* AI Comparison */}
          <div style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderTop: `2px solid ${T.gold}`,
            borderRadius: 12, padding: 20,
          }}>
            <div style={{
              fontSize: 10, color: T.textMuted,
              textTransform: "uppercase", letterSpacing: 1.5,
              marginBottom: 16, fontFamily: T.fontSans,
            }}>
              AI Comparison Report
            </div>

            {!report && !aiLoading && (
              <button onClick={fetchAI} style={{
                padding: "10px 20px", background: "transparent",
                border: `1px solid ${T.gold}`,
                borderRadius: 8, color: T.gold,
                fontSize: 14, cursor: "pointer",
                fontFamily: T.fontSans,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.goldFaint}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                Generate AI Comparison
              </button>
            )}

            {aiLoading && (
              <div style={{
                color: T.textSecondary, fontSize: 14,
                fontFamily: T.fontSans,
              }}>
                <span style={{ color: T.gold }}>●</span> Generating...
              </div>
            )}

            {report && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: `${player1.name} Edge`, value: report.player1_edge,     color: T.gold },
                  { label: `${player2.name} Edge`, value: report.player2_edge,     color: T.info },
                  { label: "Combined Analysis",    value: report.combined_analysis, color: T.warn },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    background: T.bgStat,
                    borderLeft: `2px solid ${color}`,
                    borderRadius: 8, padding: "12px 14px",
                  }}>
                    <div style={{
                      fontSize: 10, color: color,
                      textTransform: "uppercase", letterSpacing: 1.5,
                      marginBottom: 6, fontFamily: T.fontSans,
                    }}>{label}</div>
                    <div style={{
                      color: T.textSecondary, fontSize: 14,
                      lineHeight: 1.7, fontFamily: T.fontSans,
                    }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}