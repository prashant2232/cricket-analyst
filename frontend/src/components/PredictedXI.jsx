const FORMATION = [
  { role: "Bowler",     slots: 4, top: "8%"  },
  { role: "Allrounder", slots: 2, top: "32%" },
  { role: "Batsman",    slots: 4, top: "56%" },
  { role: "Batsman",    slots: 1, top: "78%" },
];

export default function PredictedXI({ players }) {
  // Separate players by role order for field layout
  const bowlers     = players.filter((_, i) => i >= 8);
  const allrounders = players.filter((_, i) => i >= 6 && i < 8);
  const batsmen     = players.filter((_, i) => i < 6).slice(1);
  const keeper      = players[0];

  const PlayerBadge = ({ player }) => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: "50%",
        background: "#0a2a1a",
        border: "2px solid #00ff88",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "#00ff88",
      }}>
        {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </div>
      <div style={{
        fontSize: 10,
        color: "#ccc",
        textAlign: "center",
        maxWidth: 70,
        lineHeight: 1.3,
      }}>
        {player.name.split(" ").slice(-1)[0]}
      </div>
    </div>
  );

  const Row = ({ group }) => (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: 20,
      flexWrap: "wrap",
    }}>
      {group.map((p, i) => <PlayerBadge key={i} player={p} />)}
    </div>
  );

  return (
    <div>
      {/* Cricket field */}
      <div style={{
        background: "#0d1f0d",
        border: "2px solid #1a3a1a",
        borderRadius: "50%",
        width: "100%",
        maxWidth: 400,
        aspectRatio: "1",
        margin: "0 auto 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "24px 16px",
        position: "relative",
      }}>
        {/* Pitch strip */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 30,
          height: 120,
          background: "#1a3a0a",
          borderRadius: 4,
          border: "1px solid #2a5a1a",
        }} />

        <Row group={bowlers} />
        <Row group={allrounders} />
        <Row group={batsmen} />
        <Row group={[keeper]} />
      </div>

      {/* Player list with AI reasons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {players.map((player, i) => (
          <div key={i} style={{
            background: "#1a1a1a",
            border: "1px solid #222",
            borderRadius: 8,
            padding: "12px 14px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 24, height: 24,
              borderRadius: "50%",
              background: "#0a2a1a",
              border: "1px solid #00ff88",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#00ff88",
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#fff",
                fontWeight: 500, marginBottom: 3 }}>
                {player.name}
              </div>
              <div style={{ fontSize: 12, color: "#666",
                lineHeight: 1.5 }}>
                {player.reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}