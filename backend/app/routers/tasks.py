from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, func, select, update
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Task
from ..schemas import StatusFilter, TaskCreate, TaskOut, TaskUpdate
from ..auth import get_current_user, require_admin


router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskOut])
def list_tasks(
    status: StatusFilter = Query("all", description="all|pending|completed"),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    stmt = select(Task)
    if status == "pending":
        stmt = stmt.where(Task.completed.is_(False))
    elif status == "completed":
        stmt = stmt.where(Task.completed.is_(True))
    tasks = db.execute(stmt.order_by(Task.created_at.desc())).scalars().all()
    return tasks


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = Task(title=payload.title, completed=False)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if payload.title is not None:
        if not payload.title:
            raise HTTPException(status_code=422, detail="Title cannot be empty")
        task.title = payload.title
    if payload.completed is not None:
        task.completed = payload.completed
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/completed", status_code=status.HTTP_200_OK)
def delete_completed(db: Session = Depends(get_db), user=Depends(require_admin)):
    stmt = delete(Task).where(Task.completed.is_(True))
    result = db.execute(stmt)
    db.commit()
    deleted = result.rowcount or 0
    return {"success": True, "message": f"已删除 {deleted} 个已完成的任务"}


@router.delete("/all", status_code=status.HTTP_200_OK)
def delete_all(db: Session = Depends(get_db), user=Depends(require_admin)):
    stmt = delete(Task)
    result = db.execute(stmt)
    db.commit()
    deleted = result.rowcount or 0
    return {"success": True, "message": "已清空所有任务"}


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return None


