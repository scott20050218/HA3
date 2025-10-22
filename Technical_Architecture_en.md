# HA3 Backend Technical Architecture

## 1. Overview

Backend for a Todo application built with FastAPI + SQLAlchemy + SQLite. Supports user registration/login, task CRUD, bulk operations and role-based permissions.

## 2. Tech Stack

- **Framework**: FastAPI (Python 3.9+)
- **ORM**: SQLAlchemy
- **Database**: SQLite (swappable with PostgreSQL/MySQL)
- **Auth**: JWT (Bearer Token)
- **Dependency management**: requirements.txt, pyproject.toml

## 3. Project Layout

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py         # FastAPI application entry, registers routers & middleware
│   ├── models.py       # ORM models (User, Task)
│   ├── database.py     # DB connection & initialization
│   ├── auth.py         # JWT auth, password hashing, dependencies
│   ├── schemas.py      # Pydantic schemas
│   └── routers/
│       ├── auth.py     # auth endpoints
│       └── tasks.py    # task endpoints
├── requirements.txt
├── pyproject.toml
├── database.db
└── tests/
    └── test_tasks.py
```

## 4. Database Schema

### users

| column        | type         | notes       |
| ------------- | ------------ | ----------- |
| id            | INTEGER      | PK, autoinc |
| username      | VARCHAR(64)  | unique      |
| password_hash | VARCHAR(255) |             |
| role          | VARCHAR(16)  | user/admin  |
| created_at    | DATETIME     |             |

### tasks

| column     | type         | notes       |
| ---------- | ------------ | ----------- |
| id         | INTEGER      | PK, autoinc |
| title      | VARCHAR(255) |             |
| completed  | BOOLEAN      |             |
| created_at | DATETIME     |             |
| updated_at | DATETIME     |             |

## 5. Auth & Permissions

- First registered user becomes `admin`, subsequent users are `user`.
- JWT tokens issued on login; tokens are required for protected endpoints.
- Admin-only endpoints: bulk delete completed, clear all.
- FastAPI `Depends` used to enforce authentication and authorization.

## 6. API Routes

- `POST /api/v1/auth/register` — register
- `POST /api/v1/auth/login` — login (form)
- `GET  /api/v1/auth/me` — current user
- `GET  /api/v1/tasks` — list tasks
- `POST /api/v1/tasks` — create task
- `PUT  /api/v1/tasks/{task_id}` — update task
- `DELETE /api/v1/tasks/{task_id}` — delete single
- `DELETE /api/v1/tasks/completed` — delete completed (admin)
- `DELETE /api/v1/tasks/all` — clear all (admin)

## 7. Implementation Notes

- Tables auto-created on first run.
- Pydantic used for validation and response models.
- JWT implementation supports expiration.
- CORS middleware enabled for frontend.
- Standardized error responses.

## 8. Development & Testing

- Run server: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- Run tests: `pytest -q`
- Env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE_MINUTES`

## 9. Security & Extensibility

- Input validation to prevent SQL injection.
- Role-based permissions.
- Easy to extend models and migrate to other DB engines.

---

_Doc version: v1.0_
_Last updated: 2025-10-22_
