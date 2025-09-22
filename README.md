## Hacker News Scraper

Tiny full‑stack project that scrapes the latest Hacker News items, stores them in a database, exposes a Flask API, and displays them in a minimal React UI.

### Overview

- Backend: Flask + SQLAlchemy (SQLite by default; PostgreSQL via Docker)
- Frontend: React + Vite + TypeScript + TanStack Query + DataTables
- Scraper: Requests + BeautifulSoup

### Tech stack

- Python: 3.11+/3.12+, Flask, SQLAlchemy
- Database: PostgreSQL (Docker) or SQLite (local dev)
- Frontend: Node 20+, Vite, React, TypeScript, TanStack Query
- UI: DataTables for tabular views

### Project structure

- `backend/` – Flask app, DB models, scraper
- `frontend/` – React app (Vite)
- `docker-compose.yml` – Services (backend, postgres, frontend)

### API endpoints

- GET `/api/articles?page=1`
  - Returns: `{ articles: [...], pagination: { page, per_page, total, pages } }`
- POST `/api/scrape`
  - Body: `{ start_page: number, page_count: number }`
  - Triggers scraping and saves articles

### Quick start (Docker) | Recommended

1. Ensure Docker daemon is running
2. From project root:

```
docker compose up --build
```

#### Services

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

#### Trigger scraping

- From the frontend: click the Scrape button
- Via CLI:

```
docker compose exec backend flask scrape --start 1 --count 1
```

where --start and --count are changeable parameters

- Via cURL or similar tool, for example:

```
curl -sS -X POST http://localhost:5000/api/scrape \
  -H 'Content-Type: application/json' \
  -d '{"start_page":20,"page_count":1}'
```

### Run locally (without Docker)

#### Backend (SQLite by default)

1. Python 3.12+ installed
2. In `backend/` create and activate a venv:

```
python3 -m venv .venv
source .venv/bin/activate
```

3. Install deps:

```
pip install -r requirements.txt
```

4. Start API:

```
flask --app app.main:app run
```

#### Frontend

1. In `frontend/` ensure Node 20+ and pnpm installed
2. Install deps:

```
pnpm install
```

3. Start dev server:

```
pnpm dev
```

#### Trigger scraping

- From the frontend or via cURL works the same way as in docker setup
- Via CLI (example from project root):

```
flask --app backend.app.main:app scrape --start 1 --count 1
```

where --start and --count are changeable parameters


### Testing

To run backend tests, navigate to backend directory and run:
```
pytest
```

To run frontend tests, navigate to frontend directory and run:
```
pnpm test
```