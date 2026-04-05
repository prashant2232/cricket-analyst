import axios from "axios";

// Development → calls backend directly on port 8000
// Production  → calls Railway backend public URL
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL || ""
    : "http://localhost:8000";

const api = axios.create({ baseURL });

export const getAllPlayers  = ()           => api.get("/api/players");
export const getPlayer      = (name)       => api.get(`/api/players/${encodeURIComponent(name)}`);
export const analyzePlayer  = (data)       => api.post("/api/analyze/player", data);
export const comparePlayers = (data)       => api.post("/api/analyze/compare", data);
export const generateXI     = (data)       => api.post("/api/analyze/xi", data);
export const seriesReport   = (p, s)       => api.post(`/api/analyze/series/${p}/${s}`);