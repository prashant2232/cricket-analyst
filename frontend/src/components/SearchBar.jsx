import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlayers } from "../services/api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  // Fetch all players once on mount
  useEffect(() => {
    getAllPlayers()
      .then((res) => setPlayers(res.data.data))
      .catch((err) => console.error("Failed to fetch players:", err));
  }, []);

  // Filter players as user types
  useEffect(() => {
    if (query.trim().length < 2) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }
    const results = players.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
    setShowDropdown(true);
  }, [query, players]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (player) => {
  setQuery("");
  setShowDropdown(false);
  const nameForUrl = player.name.toLowerCase().trim();
  console.log("Navigating to:", nameForUrl); // debug log
  navigate(`/player/${encodeURIComponent(nameForUrl)}`);
};

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: 500 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search player... (e.g. Virat Kohli)"
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          color: "#fff",
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          marginTop: 4,
          zIndex: 100,
          overflow: "hidden",
        }}>
          {filtered.map((player) => (
            <div
              key={player.name}
              onClick={() => handleSelect(player)}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #222",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#252525"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: "#fff", fontSize: 14 }}>{player.name}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "#252525",
                  color: "#888",
                }}>{player.country}</span>
                <span style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "#1a2a1a",
                  color: "#00ff88",
                }}>{player.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && filtered.length === 0 && query.length >= 2 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          marginTop: 4,
          padding: "12px 16px",
          color: "#666",
          fontSize: 14,
        }}>
          No players found
        </div>
      )}
    </div>
  );
}