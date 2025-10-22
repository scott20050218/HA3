# Backend - FastAPI for Todo App

## 环境准备

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 运行服务

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

服务启动后：

- 健康检查: http://localhost:8000/health
- API 文档（Swagger）: http://localhost:8000/docs

## 环境变量

- `DATABASE_URL`：可选，覆盖默认的 SQLite 数据库路径（默认 `sqlite:///./database.db`）。
- `JWT_SECRET`：JWT 密钥（默认 `dev-secret-change-me`，生产必须修改）。
- `JWT_EXPIRE_MINUTES`：访问令牌过期时间，默认 `60`。

## API 说明（摘要）

- `GET /api/v1/tasks?status=all|pending|completed` 列表（需登录）
- `POST /api/v1/tasks` 创建（需登录）
- `PUT /api/v1/tasks/{task_id}` 更新（需登录）
- `DELETE /api/v1/tasks/{task_id}` 删除单个（需登录）
- `DELETE /api/v1/tasks/completed` 删除所有已完成（需管理员）
- `DELETE /api/v1/tasks/all` 清空所有（需管理员）

### 认证

- `POST /api/v1/auth/register` 注册 `{ username, password }`
- `POST /api/v1/auth/login`（表单 `username`, `password`）获取 `access_token`
- 所有受保护接口需携带 `Authorization: Bearer <token>`

## 本地测试

```bash
pytest -q
```

测试会使用临时 SQLite 数据库，不影响本地数据文件。

## 目录结构

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

## 注意

- 首次运行会自动创建数据库和表。
- SQLite 的布尔类型以 `0/1` 存储，API 层返回布尔值。

## 代码风格（Lint/Format）

已在 `pyproject.toml` 配置 Ruff/Black/Isort，建议：

```bash
# 安装工具（若未安装）
pip install ruff black isort

# 代码检查
ruff check app

# 代码格式检查
black --check app

# 自动格式化
black app && isort app
```
