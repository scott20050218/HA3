# Backend - FastAPI for Todo App

## Environment Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

After the server starts:

- Health check: http://localhost:8000/health
- API docs (Swagger): http://localhost:8000/docs

## Environment variables

- `DATABASE_URL`: optional, overrides default SQLite path (`sqlite:///./database.db`).
- `JWT_SECRET`: JWT secret (default `dev-secret-change-me`, must change in production).
- `JWT_EXPIRE_MINUTES`: token expiration in minutes (default `60`).

## API summary

- `GET /api/v1/tasks?status=all|pending|completed` list (requires auth)
- `POST /api/v1/tasks` create (requires auth)
- `PUT /api/v1/tasks/{task_id}` update (requires auth)
- `DELETE /api/v1/tasks/{task_id}` delete single (requires auth)
- `DELETE /api/v1/tasks/completed` delete completed (admin only)
- `DELETE /api/v1/tasks/all` clear all (admin only)

### Auth

- `POST /api/v1/auth/register` register `{ username, password }`
- `POST /api/v1/auth/login` (form `username`, `password`) get `access_token`
- Protected endpoints require `Authorization: Bearer <token>` header

## Local tests

```bash
pytest -q
```

Tests use a temporary SQLite DB and won't modify local data files.

## Project layout

```
backend/
├── app/
│   ├── __init__.py
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── routers/
│   │   ├── auth.py
│   │   └── tasks.py
│   └── schemas.py
├── requirements.txt
├── tests/
│   └── test_tasks.py
└── README.md
```

## Notes

- The first run will auto-create the database and tables.
- SQLite stores booleans as `0/1`; API returns proper booleans.

## Code style (Lint/Format)

Ruff/Black/Isort configured via `pyproject.toml`. Recommended commands:

```bash
pip install ruff black isort
ruff check app
black --check app
black app && isort app
```
