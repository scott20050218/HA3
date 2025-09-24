# Frontend - React (Vite + TypeScript)

## 安装与启动

```bash
cd frontend
npm install
npm run dev
```

默认运行在 http://localhost:3000

## 环境变量

- `VITE_API_BASE_URL`：后端基础地址，默认 `http://localhost:8000`

在根目录创建 `.env.local` 可覆盖：

```
VITE_API_BASE_URL=http://localhost:8000
```

## 可用脚本

- `npm run dev`：开发模式
- `npm run build`：生产构建
- `npm run preview`：预览生产构建
- `npm run lint`：使用 ESLint 检查 `src` 下的 TS/TSX
- `npm run format`：使用 Prettier 格式化常见文本与代码文件

## 目录结构

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    ├── components/
    │   ├── AuthBar.tsx
    │   ├── FilterBar.tsx
    │   ├── TaskForm.tsx
    │   ├── TaskItem.tsx
    │   └── TaskList.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useTasks.ts
    ├── services/
    │   └── api.ts
    └── types/
        └── task.ts
```

## 功能说明

- 添加任务：输入框 + 按钮
- 列表展示：序列表样式，项间距
- 完成/删除：每项含完成和删除按钮
- 筛选：全部/未完成/已完成
- 批量：清除已完成、清除全部（需管理员）
- 样式：现代简洁，悬停反馈

## 鉴权使用

- 顶部 `AuthBar` 提供 登录/注册/退出；登录后 Token 自动存储在 `localStorage` 并通过拦截器注入 `Authorization: Bearer <token>`。
- 首个注册用户会被后端授予 `admin` 角色，可执行批量清理操作。

## 代码风格（Lint/Format）

已配置 ESLint/Prettier：

```bash
# 安装依赖（已在 package.json）
npm install

# 代码检查
npm run lint

# 自动格式化
npm run format
```

CI：仓库 `.github/workflows/ci.yml` 会在 PR/Push 进行前端 lint 与 format 检查。
