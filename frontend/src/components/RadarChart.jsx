import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Legend, ResponsiveContainer
} from "recharts";

export default function PlayerRadarChart({ player1, player2 }) {
  // Normalize a value to 0-100 scale
  const norm = (val, min, max) =>
    Math.round(((val - min) / (max - min)) * 100);

  const data = [
    {
      stat: "Average",
      p1: norm(player1.career_stats.average, 0, 80),
      p2: player2 ? norm(player2.career_stats.average, 0, 80) : 0,
    },
    {
      stat: "Strike Rate",
      p1: norm(player1.career_stats.strike_rate, 50, 150),
      p2: player2 ? norm(player2.career_stats.strike_rate, 50, 150) : 0,
    },
    {
      stat: "Hundreds",
      p1: norm(player1.career_stats.hundreds, 0, 55),
      p2: player2 ? norm(player2.career_stats.hundreds, 0, 55) : 0,
    },
    {
      stat: "vs Pace",
      p1: norm(player1.vs_pace, 0, 65),
      p2: player2 ? norm(player2.vs_pace, 0, 65) : 0,
    },
    {
      stat: "vs Spin",
      p1: norm(player1.vs_spin, 0, 65),
      p2: player2 ? norm(player2.vs_spin, 0, 65) : 0,
    },
    {
      stat: "Consistency",
      p1: norm(player1.career_stats.fifties, 0, 75),
      p2: player2 ? norm(player2.career_stats.fifties, 0, 75) : 0,
    },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="stat" tick={{ fill: "#888", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#555", fontSize: 10 }} />
          <Radar
            name={player1.name}
            dataKey="p1"
            stroke="#00ff88"
            fill="#00ff88"
            fillOpacity={0.2}
          />
          {player2 && (
            <Radar
              name={player2.name}
              dataKey="p2"
              stroke="#00aaff"
              fill="#00aaff"
              fillOpacity={0.2}
            />
          )}
          <Legend
            wrapperStyle={{ color: "#888", fontSize: 13 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}