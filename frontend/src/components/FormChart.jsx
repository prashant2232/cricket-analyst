import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Dot
} from "recharts";

export default function FormChart({ innings, average }) {
  const data = innings.map((score, i) => ({
    match: `Inn ${i + 1}`,
    score,
  }));

  const getDotColor = (score) => {
    if (score === 0) return "#ff4444";
    if (score >= 50) return "#00ff88";
    return "#ffaa00";
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <Dot
        cx={cx} cy={cy} r={5}
        fill={getDotColor(payload.score)}
        stroke="none"
      />
    );
  };

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="match" tick={{ fill: "#666", fontSize: 11 }} />
          <YAxis tick={{ fill: "#666", fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
            labelStyle={{ color: "#888" }}
            itemStyle={{ color: "#00ff88" }}
          />
          <ReferenceLine
            y={average}
            stroke="#444"
            strokeDasharray="4 4"
            label={{ value: `Avg ${average}`, fill: "#555", fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#00ff88"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 7, fill: "#00ff88" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}