import { useNavigate, useLocation } from "react-router-dom";
import { T } from "../theme";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label }) => (
    <button onClick={() => navigate(to)} style={{
      background: "transparent", border: "none",
      color: isActive(to) ? T.gold : T.textSecondary,
      fontSize: 13, cursor: "pointer", padding: "4px 0",
      borderBottom: isActive(to) ? `1px solid ${T.gold}` : "1px solid transparent",
      fontFamily: T.fontSans, transition: "color 0.2s",
    }}
    onMouseEnter={(e) => { if (!isActive(to)) e.currentTarget.style.color = T.textPrimary; }}
    onMouseLeave={(e) => { if (!isActive(to)) e.currentTarget.style.color = T.textSecondary; }}
    >
      {label}
    </button>
  );

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200,
      background: T.bgNav,
      borderBottom: `1px solid ${T.border}`,
      padding: "0 24px", height: 56,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
    }}>
      <button onClick={() => navigate("/")} style={{
        background: "transparent", border: "none",
        cursor: "pointer", display: "flex",
        alignItems: "center", gap: 8, padding: 0,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: T.navy,
          border: `1.5px solid ${T.gold}`,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14,
        }}>🏏</div>
        <span style={{
          color: T.textPrimary, fontSize: 15,
          fontWeight: 600, letterSpacing: 0.5,
          fontFamily: T.fontSans,
        }}>
          Cricket <span style={{ color: T.gold }}>Analyst</span>
        </span>
      </button>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <NavLink to="/"        label="Home" />
        <NavLink to="/compare" label="Compare" />
        <NavLink to="/pickxi"  label="Pick XI" />
      </div>
    </nav>
  );
}