# 用户指南（Backend & Frontend）

本指南帮助你在本地快速运行与使用待办事项应用（含鉴权）。

---

## 快速开始

### 后端

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API 文档： http://localhost:8000/docs
- 健康检查： http://localhost:8000/health

### 前端

```bash
cd frontend
npm install
npm run dev
```

- 默认： http://localhost:3000

---

## 常见操作

- 注册：在前端点击“注册”，或调用 `POST /api/v1/auth/register`
- 登录：点击“登录”或 `POST /api/v1/auth/login`（表单），将返回 `access_token`
- 创建任务：`POST /api/v1/tasks`，Body `{ "title": "..." }`
- 列表查询：`GET /api/v1/tasks?status=all|pending|completed`
- 更新任务：`PUT /api/v1/tasks/{task_id}`，Body `{ "title"?, "completed"? }`
- 删除任务：`DELETE /api/v1/tasks/{task_id}`
- 批量操作（admin）：清除已完成 `DELETE /api/v1/tasks/completed`，清空所有 `DELETE /api/v1/tasks/all`

---

## 注意事项

- 首个注册用户将成为 `admin`。
- 所有受保护接口需在 `Authorization` 头中携带 `Bearer <token>`。
- 测试用例使用临时数据库，不会影响本地 `database.db` 文件。
