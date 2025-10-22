# HA3 后端技术架构文档

## 1. 项目概述

基于 FastAPI + SQLAlchemy + SQLite 的待办事项管理后端，支持用户注册/登录、任务增删改查、批量操作、权限控制。

## 2. 技术栈

- **后端框架**：FastAPI (Python 3.9+)
- **ORM**：SQLAlchemy
- **数据库**：SQLite（可扩展为 PostgreSQL/MySQL）
- **认证**：JWT（Bearer Token）
- **依赖管理**：requirements.txt, pyproject.toml

## 3. 目录结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py         # FastAPI 应用入口，注册路由与中间件
│   ├── models.py       # ORM 数据模型（User, Task）
│   ├── database.py     # 数据库连接与初始化
│   ├── auth.py         # JWT 认证、权限依赖
│   ├── schemas.py      # Pydantic 数据校验与序列化
│   └── routers/
│       ├── auth.py     # 认证相关接口
│       └── tasks.py    # 任务相关接口
├── requirements.txt
├── pyproject.toml
├── database.db
└── tests/
    └── test_tasks.py
```

## 4. 数据库设计

### 4.1 users 表

| 字段名        | 类型         | 说明         |
| ------------- | ------------ | ------------ |
| id            | INTEGER      | 主键，自增   |
| username      | VARCHAR(64)  | 唯一，用户名 |
| password_hash | VARCHAR(255) | 密码哈希     |
| role          | VARCHAR(16)  | user/admin   |
| created_at    | DATETIME     | 创建时间     |

### 4.2 tasks 表

| 字段名     | 类型         | 说明       |
| ---------- | ------------ | ---------- |
| id         | INTEGER      | 主键，自增 |
| title      | VARCHAR(255) | 任务标题   |
| completed  | BOOLEAN      | 完成状态   |
| created_at | DATETIME     | 创建时间   |
| updated_at | DATETIME     | 更新时间   |

## 5. 认证与权限

- **注册**：首个用户自动为 admin，后续为 user
- **登录**：JWT 认证，获取 access_token
- **权限控制**：部分接口需登录，部分需 admin（如批量删除/清空任务）
- **依赖注入**：FastAPI Depends 机制实现用户身份与权限校验

## 6. API 路由设计

- `/api/v1/auth/register`：注册（POST）
- `/api/v1/auth/login`：登录（POST，表单）
- `/api/v1/auth/me`：获取当前用户（GET，需登录）
- `/api/v1/tasks`：任务列表（GET）、创建（POST）
- `/api/v1/tasks/{task_id}`：更新（PUT）、删除（DELETE）
- `/api/v1/tasks/completed`：批量删除已完成（DELETE，需 admin）
- `/api/v1/tasks/all`：清空所有（DELETE，需 admin）

## 7. 关键实现说明

- 数据库自动建表：首次启动自动创建表结构
- Pydantic 校验：所有输入/输出严格校验
- JWT 认证：自定义 token 生成与校验，支持过期时间
- CORS 支持：允许前端跨域访问
- 异常处理：标准化错误响应结构

## 8. 测试与开发

- 单元测试：`pytest`，测试用例见 `tests/`
- 本地开发：`uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- 环境变量：`DATABASE_URL`、`JWT_SECRET`、`JWT_EXPIRE_MINUTES`

## 9. 安全与扩展性

- 输入校验与 SQL 注入防护
- 认证与权限分级
- 可扩展为多用户、多角色、更多任务字段
- 支持数据库替换为 PostgreSQL/MySQL

---

_本文档版本：v1.0_
_最后更新：2025-10-22_
