import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Dot,
} from "recharts";
import { T } from "../theme";

export default function FormChart({ innings, average }) {
  const data = innings.map((score, i) => ({
    match: `Inn ${i + 1}`,
    score,
  }));

  const getDotColor = (score) => {
    if (score === 0)   return T.bad;
    if (score >= 50)   return T.good;
    return T.warn;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <Dot
        cx={cx} cy={cy} r={5}
        fill={getDotColor(payload.score)}
        stroke={T.bgCard}
        strokeWidth={2}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const score = payload[0].value;
    return (
      <div style={{
        background: T.bgNav,
        border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "8px 12px",
      }}>
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{label}</div>
        <div style={{
          fontSize: 16, fontWeight: 700,
          color: getDotColor(score),
        }}>
          {score} runs
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
          <XAxis
            dataKey="match"
            tick={{ fill: T.textMuted, fontSize: 11 }}
            axisLine={{ stroke: T.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: T.textMuted, fontSize: 11 }}
            axisLine={{ stroke: T.border }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={average}
            stroke={T.navyLight}
            strokeDasharray="4 4"
            label={{
              value: `Avg ${average}`,
              fill: T.textMuted,
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke={T.gold}
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 7, fill: T.gold, stroke: T.bgCard, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}