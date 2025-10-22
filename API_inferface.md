# API Documentation (Backend & Frontend)

## Overview

- Backend base URL: `http://localhost:8000/api/v1` (replace port if changed)
- Frontend base URL: `http://localhost:3000` (or Vite specified port)
- Auth: Bearer Token (JWT), some endpoints require login, some require admin role
- Data format: `application/json`

---

## Authentication (Auth)

### Register

- Method: POST
- Path: `/auth/register`
- Notes: The first registered user will be granted `admin`; subsequent users are `user`
- Request (JSON):

```json
{
  "username": "string(min:3,max:64)",
  "password": "string(min:6,max:128)"
}
```

- Response: 201 Created

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

- Possible errors: 400 Username already exists; 422 validation error

### Login

- Method: POST
- Path: `/auth/login`
- Notes: Form submission to get access token (JWT)
- Request (`application/x-www-form-urlencoded`):

```
username=admin&password=secret123
```

- Response: 200 OK

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

- Possible errors: 400 Incorrect username or password

### Current user

- Method: GET
- Path: `/auth/me`
- Header: `Authorization: Bearer <token>`
- Response: 200 OK

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

- Possible errors: 401 Unauthorized (missing or invalid token)

---

## Tasks

Task shape:

```json
{
  "id": 1,
  "title": "Learn React",
  "completed": false,
  "created_at": "2025-01-27T10:00:00",
  "updated_at": "2025-01-27T10:00:00"
}
```

### List

- Method: GET
- Path: `/tasks`
- Header: `Authorization: Bearer <token>`
- Query: `status=all|pending|completed` (default all)
- Response: 200 OK

```json
[
  {
    "id": 1,
    "title": "Learn React",
    "completed": false,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

- Possible errors: 401 Unauthorized

### Create

- Method: POST
- Path: `/tasks`
- Header: `Authorization: Bearer <token>`
- Request (JSON):

```json
{ "title": "Learn FastAPI" }
```

- Response: 201 Created (task object)
- Possible errors: 401 Unauthorized; 422 validation error

### Update

- Method: PUT
- Path: `/tasks/{task_id}`
- Header: `Authorization: Bearer <token>`
- Request (JSON, partial allowed):

```json
{ "title": "New title", "completed": true }
```

- Response: 200 OK (task object)
- Possible errors: 401 Unauthorized; 404 Not Found; 422 validation error

### Delete single

- Method: DELETE
- Path: `/tasks/{task_id}`
- Header: `Authorization: Bearer <token>`
- Response: 204 No Content
- Possible errors: 401 Unauthorized; 404 Not Found

### Bulk delete completed (admin)

- Method: DELETE
- Path: `/tasks/completed`
- Header: `Authorization: Bearer <token>` (admin)
- Response: 200 OK

```json
{ "success": true, "message": "Deleted N completed tasks" }
```

- Possible errors: 401 Unauthorized; 403 Forbidden

### Clear all (admin)

- Method: DELETE
- Path: `/tasks/all`
- Header: `Authorization: Bearer <token>` (admin)
- Response: 200 OK

```json
{ "success": true, "message": "Cleared all tasks" }
```

- Possible errors: 401 Unauthorized; 403 Forbidden

---

## Error format

- Default error shape:

```json
{
  "detail": "error description"
}
```

- Auth failure (401): `{"detail": "Not authenticated"}` or `{"detail": "Could not validate credentials"}`
- Forbidden (403): `{"detail": "Admin privileges required"}`
- Not found (404): `{"detail": "Task not found"}`
- Validation (422): FastAPI/Pydantic validation error structure

---

## cURL examples

### Register + Login + Create

```bash
# Register
curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123"}'

# Login (form)
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=admin&password=secret123' | jq -r .access_token)

echo "TOKEN=$TOKEN"

# Create task
curl -s -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI"}'

# List tasks
curl -s -X GET 'http://localhost:8000/api/v1/tasks?status=all' \
  -H "Authorization: Bearer $TOKEN"
```
