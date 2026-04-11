import { T } from "../theme";

export default function PlayerCard({ player }) {
  const { name, country, role, batting_style, bowling_style,
          career_stats, bowling_stats, vs_pace, vs_spin, icc_ranking } = player;

  const roleLower = role.toLowerCase();
  const isBatsman    = roleLower === "batsman";
  const isBowler     = roleLower === "bowler";
  const isAllrounder = roleLower === "allrounder";

  const avgColor = career_stats.average >= 40 ? T.good :
                   career_stats.average >= 25 ? T.warn : T.bad;

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const StatBox = ({ label, value, color }) => (
    <div style={{
      background: T.bgStat, borderRadius: 8,
      padding: "10px 12px", textAlign: "center",
      border: `1px solid ${T.border}`,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: color || T.textPrimary }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{label}</div>
    </div>
  );

  const Bar = ({ label, value, max = 65 }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: T.textSecondary }}>{label}</span>
        <span style={{ fontSize: 12, color: T.gold }}>{value}</span>
      </div>
      <div style={{ background: T.navy, borderRadius: 4, height: 4 }}>
        <div style={{
          width: `${Math.min((value / max) * 100, 100)}%`,
          background: T.gold, height: "100%",
          borderRadius: 4, transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );

  const SectionLabel = ({ text }) => (
    <div style={{
      fontSize: 10, color: T.textMuted,
      textTransform: "uppercase", letterSpacing: 1.5,
      marginBottom: 10, marginTop: 16,
    }}>{text}</div>
  );

  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderTop: `2px solid ${T.gold}`,
      borderRadius: 12, padding: 20,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: T.navy, border: `2px solid ${T.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: T.gold, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 20, fontWeight: 700,
            color: T.textPrimary, fontFamily: T.fontSerif,
          }}>{name}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 4,
              background: T.navy, color: T.textSecondary,
            }}>{country}</span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 4,
              background: T.goldFaint, color: T.gold,
              border: `1px solid ${T.goldBorder}`,
            }}>{role}</span>
            <span style={{ fontSize: 12, color: T.textMuted }}>ICC #{icc_ranking}</span>
          </div>
        </div>
      </div>

      {/* Batting stats */}
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
            <StatBox label="100s"        value={career_stats.hundreds} color={T.gold} />
            <StatBox label="50s"         value={career_stats.fifties} />
          </div>
          <Bar label="vs Pace" value={vs_pace} />
          <Bar label="vs Spin" value={vs_spin} />
        </>
      )}

      {/* Bowling stats */}
      {(isBowler || isAllrounder) && bowling_stats && (
        <>
          <SectionLabel text={isAllrounder ? "Bowling" : "Bowling Career Stats"} />
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8, marginBottom: 16,
          }}>
            <StatBox label="Wickets"     value={bowling_stats.wickets}      color={T.gold} />
            <StatBox label="Average"     value={bowling_stats.average} />
            <StatBox label="Economy"     value={bowling_stats.economy} />
            <StatBox label="Strike Rate" value={bowling_stats.strike_rate} />
            <StatBox label="5-Wickets"   value={bowling_stats.five_wickets} color={T.warn} />
            <StatBox label="Best"        value={bowling_stats.best} />
          </div>
        </>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: T.textMuted }}>
        {batting_style} · {bowling_style}
      </div>
    </div>
  );
}