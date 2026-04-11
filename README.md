# Cricket Performance Analyst AI

A full-stack AI-powered cricket analytics web application built with 
React, FastAPI, Redis, and Google Gemini Pro. Fully containerized with Docker.

## Live Demo
https://frontend-production-703c.up.railway.app

## Backend API
https://cricket-analyst-production.up.railway.app

## Screenshots
![alt text](<Screenshot 2026-04-11 211607.png>)
![alt text](<Screenshot 2026-04-11 211511.png>) 
![alt text](<Screenshot 2026-04-11 211527.png>) 
![alt text](<Screenshot 2026-04-11 211548.png>)


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Recharts, React Router |
| Backend | FastAPI (Python 3.11) |
| AI | Google Gemini Pro API |
| Cache | Redis (24hr TTL) |
| Storage | Supabase Storage (AI report backup) |
| Container | Docker, Docker Compose |
| Web Server | Nginx (reverse proxy + static files) |
| CI/CD | GitHub Actions → Railway |

## Features

- **Player Search** — Search any of 20 international players with autocomplete
- **Live Stats** — Career stats, last 10 innings form chart, recent series
- **AI Analyst Report** — Gemini Pro generates 5-section analysis per player
- **Head-to-Head Compare** — Role-filtered comparison (Batsmen/Bowlers/Allrounders)
  with radar chart and AI comparison report
- **Predicted XI** — AI picks best 11 players for any match type and pitch condition
- **Redis Caching** — Player data cached for 24 hours to minimize API calls
- **Supabase Backup** — Every AI report backed up to Supabase Storage as JSON

## Architecture

Browser
│
▼
Nginx (port 80)
├── /          → React static files
└── /api/*     → FastAPI (port 8000, internal)
├── Redis cache (port 6379, internal)
├── CricketData.org API (live player stats)
├── Gemini Pro API (AI reports)
└── Supabase Storage (report backup)

## Docker Setup

### Development
```bash
# Start all 3 containers with hot reload
docker-compose up --build

# Frontend: http://localhost:3001
# Backend:  http://localhost:8000
# Docs:     http://localhost:8000/docs
```

### Production
```bash
# Multi-stage build — React built by Node, served by Nginx
docker-compose -f docker-compose.prod.yml up --build

# App: http://localhost
# API: http://localhost/api/health
```

### Useful commands
```bash
# Clear Redis cache
docker exec cricket-redis redis-cli FLUSHALL

# View backend logs
docker logs cricket-backend

# Rebuild single service
docker-compose up --build backend
```

## Environment Variables

Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
CRICDATA_API_KEY=your_cricdata_api_key
REDIS_URL=redis://redis:6379
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/players` | List all 20 players |
| GET | `/api/players/{name}` | Full player data |
| POST | `/api/analyze/player` | AI report for one player |
| POST | `/api/analyze/compare` | AI comparison of two players |
| POST | `/api/analyze/xi` | Generate predicted XI |
| POST | `/api/analyze/series/{player}/{series}` | Series report |

## Players Covered

**India:** Virat Kohli, Rohit Sharma, Shubman Gill, KL Rahul, Shreyas Iyer,
Hardik Pandya, Ravindra Jadeja, Jasprit Bumrah, Mohammed Shami, Kuldeep Yadav

**International:** Babar Azam, Kane Williamson, Joe Root, Steve Smith,
David Warner, Ben Stokes, Pat Cummins, Shaheen Afridi, Trent Boult, Kagiso Rabada

## CI/CD Pipeline

On every push to `main`, GitHub Actions:
1. Builds the Docker image for the backend
2. Pushes to Docker Hub
3. Deploys to Railway automatically

## Local Development Setup
```bash
# 1. Clone the repo
git clone https://github.com/yourusername/cricket-analyst.git
cd cricket-analyst

# 2. Add your API keys
cp backend/.env.example backend/.env
# Edit backend/.env with your keys

# 3. Start development environment
docker-compose up --build

# 4. Open http://localhost:3001
```

## Project Structure

cricket-analyst/
├── backend/
│   ├── data/          # Player context data
│   ├── prompts/       # Gemini prompt templates
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic + external APIs
│   ├── Dockerfile
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── Dockerfile
│   └── Dockerfile.prod
├── nginx/
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
└── docker-compose.prod.yml