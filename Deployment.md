# Deployment Guide

This guide covers quick deployment for local development, testing and production for the backend (FastAPI), frontend (React+Vite), and database (SQLite).

---

## 1. Environment

### Requirements

- Recommended OS: Linux / macOS / Windows 10+
- Python 3.8+
- Node.js 18+
- Git (optional)

### Tools

- pip (Python package manager)
- npm or yarn (Node package manager)

---

## 2. Backend Deployment (FastAPI + SQLite)

### 1. Create virtualenv

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing:

```bash
pip install fastapi uvicorn sqlalchemy python-multipart
```

### 3. Run server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- Default port: 8000
- First run creates the database and tables automatically
- Swagger: http://127.0.0.1:8000/docs

### 4. Production recommendations

- Use Gunicorn + Uvicorn worker:

```bash
pip install gunicorn
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

- Use Supervisor or systemd to manage the process
- Replace SQLite with a persistent DB like PostgreSQL/MySQL

---

## 3. Frontend Deployment (React + Vite)

### 1. Install

```bash
cd frontend
npm install
```

### 2. Development

```bash
npm run dev
```

Default: http://localhost:3000

### 3. Production build

```bash
npm run build
```

Build output in `frontend/dist/` — serve via Nginx/Apache or deploy to CDN.

---

## 4. Docker recommendation

- Use `docker-compose` to deploy frontend, backend, and DB together
- Set production `ENV` (e.g. `JWT_SECRET`) in Dockerfile or compose env

---

## 5. Troubleshooting

- Port conflict: change `--port` or stop occupying process
- 401/403: check token and permissions
- CORS: confirm `VITE_API_BASE_URL` and allowed origins

---

Good luck with your deployment!
