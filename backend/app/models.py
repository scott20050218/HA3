from __future__ import annotations

from sqlalchemy import Boolean, Column, DateTime, Integer, String, func, UniqueConstraint

from .database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, nullable=False, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    updated_at = Column(DateTime(timezone=True), server_default=func.current_timestamp(), onupdate=func.current_timestamp())


class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("username", name="uq_users_username"),)

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(16), nullable=False, server_default="user")  # 'user' or 'admin'
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())


