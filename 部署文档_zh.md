# 部署文档

本部署文档适用于本地开发环境、测试环境及生产环境的快速部署，覆盖后端（FastAPI）、前端（React+Vite）及数据库（SQLite）。

---

## 一、环境准备

### 1. 系统要求

- 推荐操作系统：Linux / macOS / Windows 10+
- Python 3.8 及以上
- Node.js 18 及以上
- Git（可选，便于代码管理）

### 2. 依赖工具

- pip（Python 包管理器）
- npm 或 yarn（Node 包管理器）

---

## 二、后端部署（FastAPI + SQLite）

### 1. 创建虚拟环境

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows 用 .venv\Scripts\activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

如果 `requirements.txt` 缺失，可手动安装：

```bash
pip install fastapi uvicorn sqlalchemy python-multipart
```

### 3. 启动服务

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- 默认监听 8000 端口
- 首次启动会自动创建数据库和表
- 查看 Swagger： http://127.0.0.1:8000/docs

### 4. 生产环境建议

- 使用 Gunicorn + Uvicorn worker：

```bash
pip install gunicorn
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

- 使用 Supervisor 或 systemd 管理进程
- 将数据库替换为持久化的 PostgreSQL/MySQL

---

## 三、前端部署（React + Vite）

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 本地开发

```bash
npm run dev
```

默认访问： http://localhost:3000

### 3. 生产构建

```bash
npm run build
```

构建输出在 `frontend/dist/`，可用 Nginx/Apache 或 CDN 部署静态资源。

---

## 四、Docker 化建议

- 推荐使用 `docker-compose` 将前端、后端和数据库一起部署
- 在 Dockerfile 中设置生产级别的 `ENV`（如 `JWT_SECRET`）

---

## 五、常见问题

- 端口占用：更换 `--port` 或停止占用进程
- 401/403：检查 Token 与权限
- CORS：确认前端 `VITE_API_BASE_URL` 与后端允许的 origin

---

祝部署顺利！
