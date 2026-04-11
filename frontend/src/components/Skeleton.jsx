import { T } from "../theme";

const shimmer = `
  @keyframes shimmer {
    0%   { opacity: 0.3; }
    50%  { opacity: 0.6; }
    100% { opacity: 0.3; }
  }
`;

export default function Skeleton({ width = "100%", height = 16, borderRadius = 6 }) {
  return (
    <>
      <style>{shimmer}</style>
      <div style={{
        width, height, borderRadius,
        background: T.navy,
        animation: "shimmer 1.4s ease-in-out infinite",
      }} />
    </>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderTop: `2px solid ${T.gold}`,
      borderRadius: 12, padding: 20,
    }}>
      <style>{shimmer}</style>
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: T.navy,
          animation: "shimmer 1.4s ease-in-out infinite",
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, display: "flex",
          flexDirection: "column", gap: 8, justifyContent: "center" }}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <div style={{ display: "grid",
        gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            background: T.bgStat, borderRadius: 8,
            padding: "10px 12px", border: `1px solid ${T.border}`,
          }}>
            <Skeleton height={20} borderRadius={4} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width="60%" height={10} borderRadius={4} />
            </div>
          </div>
        ))}
      </div>
      <Skeleton height={8} borderRadius={4} />
      <div style={{ marginTop: 8 }}>
        <Skeleton height={8} borderRadius={4} />
      </div>
    </div>
  );
}