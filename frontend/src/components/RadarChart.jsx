import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Legend, ResponsiveContainer,
} from "recharts";
import { T } from "../theme";

export default function PlayerRadarChart({ player1, player2 }) {
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

  const CustomLegend = () => (
    <div style={{
      display: "flex", justifyContent: "center",
      gap: 20, marginTop: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 12, height: 12, borderRadius: 2,
          background: T.gold, opacity: 0.8,
        }} />
        <span style={{
          fontSize: 12, color: T.textSecondary,
          fontFamily: T.fontSans,
        }}>
          {player1.name}
        </span>
      </div>
      {player2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 12, height: 12, borderRadius: 2,
            background: T.info, opacity: 0.8,
          }} />
          <span style={{
            fontSize: 12, color: T.textSecondary,
            fontFamily: T.fontSans,
          }}>
            {player2.name}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke={T.border} />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: T.textSecondary, fontSize: 12, fontFamily: T.fontSans }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: T.textMuted, fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name={player1.name}
            dataKey="p1"
            stroke={T.gold}
            fill={T.gold}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          {player2 && (
            <Radar
              name={player2.name}
              dataKey="p2"
              stroke={T.info}
              fill={T.info}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          )}
          <Legend content={<CustomLegend />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}