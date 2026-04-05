import { useNavigate } from "react-router-dom";
import CompareView from "../components/CompareView";

export default function ComparePage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px",
      maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate("/")} style={{
        background: "transparent", border: "none",
        color: "#666", cursor: "pointer",
        fontSize: 14, marginBottom: 20, padding: 0,
      }}>
        ← Back
      </button>
      <div style={{ fontSize: 24, fontWeight: 700,
        color: "#fff", marginBottom: 6 }}>
        Head-to-Head
      </div>
      <div style={{ fontSize: 14, color: "#555", marginBottom: 24 }}>
        Compare any two players side by side
      </div>
      <CompareView />
    </div>
  );
}