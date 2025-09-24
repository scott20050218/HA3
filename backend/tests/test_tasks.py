from __future__ import annotations

import os
from contextlib import contextmanager

import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.database import SessionLocal
from app.models import User


@contextmanager
def use_tmp_sqlite(tmp_path):
    db_path = tmp_path / "test.db"
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
    try:
        yield str(db_path)
    finally:
        os.environ.pop("DATABASE_URL", None)


@pytest.fixture()
def client(tmp_path):
    with use_tmp_sqlite(tmp_path):
        app = create_app()
        with TestClient(app) as c:
            # register user (first user auto-admin)
            r = c.post("/api/v1/auth/register", json={"username": "admin", "password": "secret123"})
            assert r.status_code in (200, 201)
            # login get token
            r = c.post("/api/v1/auth/login", data={"username": "admin", "password": "secret123"}, headers={"Content-Type": "application/x-www-form-urlencoded"})
            assert r.status_code == 200
            token = r.json()["access_token"]
            c.headers.update({"Authorization": f"Bearer {token}"})
            yield c


def test_health(client: TestClient):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_create_and_list_task(client: TestClient):
    # create
    r = client.post("/api/v1/tasks", json={"title": "学习 FastAPI"})
    assert r.status_code == 201
    data = r.json()
    assert data["title"] == "学习 FastAPI"
    assert data["completed"] is False

    # list all
    r = client.get("/api/v1/tasks")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1


def test_filters_and_updates_and_deletes(client: TestClient):
    # seed
    client.post("/api/v1/tasks", json={"title": "A"})
    client.post("/api/v1/tasks", json={"title": "B"})

    # complete one
    r = client.put("/api/v1/tasks/1", json={"completed": True})
    assert r.status_code == 200
    assert r.json()["completed"] is True

    # filter pending
    r = client.get("/api/v1/tasks", params={"status": "pending"})
    assert r.status_code == 200
    assert all(item["completed"] is False for item in r.json())

    # filter completed
    r = client.get("/api/v1/tasks", params={"status": "completed"})
    assert r.status_code == 200
    assert all(item["completed"] is True for item in r.json())

    # delete completed
    r = client.delete("/api/v1/tasks/completed")
    assert r.status_code == 200

    # delete all
    r = client.delete("/api/v1/tasks/all")
    assert r.status_code == 200


