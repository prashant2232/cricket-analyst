import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlayers } from "../services/api";
import { T } from "../theme";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    getAllPlayers()
      .then((res) => setPlayers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setFiltered([]); setShowDropdown(false); return; }
    const results = players.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
    setShowDropdown(true);
  }, [query, players]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (player) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/player/${encodeURIComponent(player.name.toLowerCase())}`);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: 500 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: T.bgInput,
        border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "10px 14px",
      }}>
        <span style={{ color: T.textMuted, fontSize: 16 }}>⌕</span>
        <input
          type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player... (e.g. Virat Kohli)"
          style={{
            flex: 1, background: "transparent",
            border: "none", outline: "none",
            color: T.textPrimary, fontSize: 14,
            fontFamily: T.fontSans,
          }}
        />
      </div>

      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: T.bgNav, border: `1px solid ${T.border}`,
          borderRadius: 8, marginTop: 4, zIndex: 100, overflow: "hidden",
        }}>
          {filtered.map((player) => (
            <div key={player.name} onClick={() => handleSelect(player)}
              style={{
                padding: "10px 14px", cursor: "pointer",
                borderBottom: `1px solid ${T.border}`,
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.navy}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: T.textPrimary, fontSize: 14 }}>{player.name}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{
                  fontSize: 11, padding: "2px 7px", borderRadius: 4,
                  background: T.navy, color: T.textSecondary,
                }}>{player.country}</span>
                <span style={{
                  fontSize: 11, padding: "2px 7px", borderRadius: 4,
                  background: T.goldFaint, color: T.gold,
                  border: `1px solid ${T.goldBorder}`,
                }}>{player.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && filtered.length === 0 && query.length >= 2 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: T.bgNav, border: `1px solid ${T.border}`,
          borderRadius: 8, marginTop: 4, padding: "12px 14px",
          color: T.textMuted, fontSize: 13,
        }}>
          No players found
        </div>
      )}
    </div>
  );
}