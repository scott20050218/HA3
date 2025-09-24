from __future__ import annotations

from typing import Literal, Optional

from datetime import datetime
from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    completed: Optional[bool] = None


class TaskCreate(BaseModel):
    title: str = Field(..., max_length=255, description="任务标题")


class TaskUpdate(TaskBase):
    pass


class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


StatusFilter = Literal["all", "pending", "completed"]


# Auth
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    password: str = Field(..., min_length=6, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    username: str
    role: Literal["user", "admin"]

    class Config:
        from_attributes = True


