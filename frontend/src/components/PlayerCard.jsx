export default function PlayerCard({ player }) {
  const { name, country, role, batting_style, bowling_style,
          career_stats, bowling_stats, vs_pace, vs_spin, icc_ranking } = player;

  const roleLower = role.toLowerCase();
  const isBatsman    = roleLower === "batsman";
  const isBowler     = roleLower === "bowler";
  const isAllrounder = roleLower === "allrounder";

  const avgColor =
    career_stats.average >= 40 ? "#00ff88" :
    career_stats.average >= 25 ? "#ffaa00" : "#ff4444";

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const StatBox = ({ label, value, color }) => (
    <div style={{
      background: "#111", borderRadius: 8,
      padding: "10px 12px", textAlign: "center",
    }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: color || "#fff" }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{label}</div>
    </div>
  );

  const Bar = ({ label, value, max = 65 }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
        <span style={{ fontSize: 12, color: "#00ff88" }}>{value}</span>
      </div>
      <div style={{ background: "#222", borderRadius: 4, height: 4 }}>
        <div style={{
          width: `${Math.min((value / max) * 100, 100)}%`,
          background: "#00ff88", height: "100%",
          borderRadius: 4, transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );

  const SectionLabel = ({ text }) => (
    <div style={{
      fontSize: 11, color: "#555", textTransform: "uppercase",
      letterSpacing: 1, marginBottom: 10, marginTop: 16,
    }}>
      {text}
    </div>
  );

  return (
    <div style={{
      background: "#1a1a1a", border: "1px solid #222",
      borderRadius: 12, padding: 20,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "#0a2a1a", border: "2px solid #00ff88",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: "#00ff88", flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{name}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#888" }}>{country}</span>
            <span style={{ color: "#333" }}>·</span>
            <span style={{ fontSize: 12, color: "#00ff88" }}>{role}</span>
            <span style={{ color: "#333" }}>·</span>
            <span style={{ fontSize: 12, color: "#666" }}>ICC #{icc_ranking}</span>
          </div>
        </div>
      </div>

      {/* Batting stats — shown for batsmen and allrounders */}
      {(isBatsman || isAllrounder) && (
        <>
          {isAllrounder && <SectionLabel text="Batting" />}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8, marginBottom: 16,
          }}>
            <StatBox label="Matches"     value={career_stats.matches} />
            <StatBox label="Runs"        value={career_stats.runs.toLocaleString()} />
            <StatBox label="Average"     value={career_stats.average} color={avgColor} />
            <StatBox label="Strike Rate" value={career_stats.strike_rate} />
            <StatBox label="100s"        value={career_stats.hundreds} color="#ffaa00" />
            <StatBox label="50s"         value={career_stats.fifties} />
          </div>
          <Bar label="vs Pace" value={vs_pace} />
          <Bar label="vs Spin" value={vs_spin} />
        </>
      )}

      {/* Bowling stats — shown for bowlers and allrounders */}
      {(isBowler || isAllrounder) && bowling_stats && (
        <>
          <SectionLabel text={isAllrounder ? "Bowling" : "Bowling Career Stats"} />
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8, marginBottom: 16,
          }}>
            <StatBox label="Wickets"     value={bowling_stats.wickets} color="#00ff88" />
            <StatBox label="Average"     value={bowling_stats.average} />
            <StatBox label="Economy"     value={bowling_stats.economy} />
            <StatBox label="Strike Rate" value={bowling_stats.strike_rate} />
            <StatBox label="5-Wickets"   value={bowling_stats.five_wickets} color="#ffaa00" />
            <StatBox label="Best"        value={bowling_stats.best} />
          </div>
        </>
      )}

      {/* Style info */}
      <div style={{ marginTop: 8, fontSize: 12, color: "#444" }}>
        {batting_style} · {bowling_style}
      </div>
    </div>
  );
}