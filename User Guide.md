# User Guide (Backend & Frontend)

This guide helps you run and use the Todo application locally (includes authentication).

---

## Quick start

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Default: http://localhost:3000

---

## Common actions

- Register: use the front-end UI or `POST /api/v1/auth/register`
- Login: use the UI or `POST /api/v1/auth/login` (form) to receive an `access_token`
- Create task: `POST /api/v1/tasks` body `{ "title": "..." }`
- List tasks: `GET /api/v1/tasks?status=all|pending|completed`
- Update task: `PUT /api/v1/tasks/{task_id}` body `{ "title"?, "completed"? }`
- Delete task: `DELETE /api/v1/tasks/{task_id}`
- Admin bulk: `DELETE /api/v1/tasks/completed`, `DELETE /api/v1/tasks/all`

---

## Notes

- The first registered user becomes `admin`.
- Protected endpoints require `Authorization: Bearer <token>` header.
- Tests use a temporary database and won't affect local `database.db`.
