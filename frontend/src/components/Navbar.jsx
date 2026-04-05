import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label }) => (
    <button
      onClick={() => navigate(to)}
      style={{
        background: "transparent",
        border: "none",
        color: isActive(to) ? "#00ff88" : "#666",
        fontSize: 14,
        cursor: "pointer",
        padding: "4px 0",
        borderBottom: isActive(to) ? "1px solid #00ff88" : "1px solid transparent",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isActive(to)) e.currentTarget.style.color = "#aaa";
      }}
      onMouseLeave={(e) => {
        if (!isActive(to)) e.currentTarget.style.color = "#666";
      }}
    >
      {label}
    </button>
  );

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 200,
      background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid #1a1a1a",
      padding: "0 24px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 0,
        }}
      >
        <div style={{
          width: 28, height: 28,
          borderRadius: "50%",
          background: "#0a2a1a",
          border: "1.5px solid #00ff88",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}>
          🏏
        </div>
        <span style={{
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}>
          Cricket <span style={{ color: "#00ff88" }}>Analyst</span>
        </span>
      </button>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <NavLink to="/"        label="Home" />
        <NavLink to="/compare" label="Compare" />
        <NavLink to="/pickxi"  label="Pick XI" />
      </div>
    </nav>
  );
}