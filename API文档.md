# API 文档（Backend & Frontend）

## 概览

- 后端基址：`http://localhost:8000/api/v1`（若改端口，请相应替换）
- 前端基址：`http://localhost:3000`（或 Vite 指定端口）
- 鉴权方式：Bearer Token（JWT），部分接口需登录，部分需管理员角色
- 数据格式：`application/json`

---

## 认证（Auth）

### 注册

- 方法：POST
- 路径：`/auth/register`
- 说明：首次注册的用户会被授予 `admin` 角色；之后注册的为普通 `user`
- 请求（JSON）：

```json
{
  "username": "string(min:3,max:64)",
  "password": "string(min:6,max:128)"
}
```

- 响应：201 Created

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

- 可能错误：400 Username already exists；422 参数校验失败

### 登录

- 方法：POST
- 路径：`/auth/login`
- 说明：表单提交，获取访问令牌（JWT）
- 请求（`application/x-www-form-urlencoded`）：

```
username=admin&password=secret123
```

- 响应：200 OK

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

- 可能错误：400 Incorrect username or password

### 当前用户

- 方法：GET
- 路径：`/auth/me`
- 头部：`Authorization: Bearer <token>`
- 响应：200 OK

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

- 可能错误：401 Unauthorized（未携带或无效 Token）

---

## 任务（Tasks）

任务数据结构：

```json
{
  "id": 1,
  "title": "学习 React",
  "completed": false,
  "created_at": "2025-01-27T10:00:00",
  "updated_at": "2025-01-27T10:00:00"
}
```

### 列表查询

- 方法：GET
- 路径：`/tasks`
- 头部：`Authorization: Bearer <token>`
- 查询参数：`status=all|pending|completed`（默认 all）
- 响应：200 OK

```json
[
  {
    "id": 1,
    "title": "学习 React",
    "completed": false,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

- 可能错误：401 Unauthorized

### 创建任务

- 方法：POST
- 路径：`/tasks`
- 头部：`Authorization: Bearer <token>`
- 请求（JSON）：

```json
{ "title": "学习 FastAPI" }
```

- 响应：201 Created（任务对象）
- 可能错误：401 Unauthorized；422 参数校验失败

### 更新任务（标题/完成状态）

- 方法：PUT
- 路径：`/tasks/{task_id}`
- 头部：`Authorization: Bearer <token>`
- 请求（JSON，可部分字段）：

```json
{ "title": "新标题", "completed": true }
```

- 响应：200 OK（任务对象）
- 可能错误：401 Unauthorized；404 Not Found；422 参数校验失败

### 删除单个任务

- 方法：DELETE
- 路径：`/tasks/{task_id}`
- 头部：`Authorization: Bearer <token>`
- 响应：204 No Content
- 可能错误：401 Unauthorized；404 Not Found

### 批量删除已完成（管理员）

- 方法：DELETE
- 路径：`/tasks/completed`
- 头部：`Authorization: Bearer <token>`（admin）
- 响应：200 OK

```json
{ "success": true, "message": "已删除 N 个已完成的任务" }
```

- 可能错误：401 Unauthorized；403 Forbidden

### 清空所有（管理员）

- 方法：DELETE
- 路径：`/tasks/all`
- 头部：`Authorization: Bearer <token>`（admin）
- 响应：200 OK

```json
{ "success": true, "message": "已清空所有任务" }
```

- 可能错误：401 Unauthorized；403 Forbidden

---

## 错误响应规范

- 通用错误结构：

```json
{
  "detail": "错误描述"
}
```

- 认证失败（401）：`{"detail": "Not authenticated"}` 或 `{"detail": "Could not validate credentials"}`
- 权限不足（403）：`{"detail": "Admin privileges required"}`
- 资源不存在（404）：`{"detail": "Task not found"}`
- 参数错误（422）：FastAPI/Pydantic 校验错误结构

---

## cURL 示例

### 注册 + 登录 + 创建任务

```bash
# 注册
curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123"}'

# 登录（表单）
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=admin&password=secret123' | jq -r .access_token)

echo "TOKEN=$TOKEN"

# 创建任务
curl -s -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"学习 FastAPI"}'

# 查询任务
curl -s -X GET 'http://localhost:8000/api/v1/tasks?status=all' \
  -H "Authorization: Bearer $TOKEN"
```

---

## 前端对接说明

### 环境变量

- `VITE_API_BASE_URL`：后端基础地址，默认 `http://localhost:8000`

### 服务封装（`src/services/api.ts`）

- 任务：
  - `listTasks(status)`
  - `createTask(title)`
  - `updateTask(id, { title?, completed? })`
  - `deleteTask(id)`
  - `clearCompleted()`（管理员）
  - `clearAll()`（管理员）
- 认证：
  - `register(username, password)`
  - `login(username, password)` → 自动 `saveToken`
  - `me()` → 获取当前用户（无效 Token 返回 null）
- 拦截器：自动从 `localStorage` 获取 Token 注入 `Authorization`

### 组件/状态

- `AuthBar`：登录/注册/退出与结果提示
- `useAuth`：管理登录状态、持久化 Token
- `useTasks`：统一管理任务的增删改查、筛选、批量操作

---

## 角色与权限

- `admin`：可执行批量删除、清空所有任务等危险操作
- `user`：可进行个人任务的查询/创建/更新/删除
- 首个注册用户自动为 `admin`

---

## 版本

- 文档版本：v1.0
- 最后更新：2025-09-24

