# Full Stack Demo

基于 **Monorepo + pnpm + Turborepo + Supabase + Next.js + shadcn/ui + Tailwind + Recharts** 搭建的全栈管理系统。

## 技术栈

| 层级 | 技术 |
|------|------|
| Monorepo | pnpm workspaces + Turborepo |
| 前端框架 | Next.js 14 (App Router) |
| UI 组件 | shadcn/ui + Tailwind CSS |
| 图表 | Recharts |
| 后端/数据库 | Supabase Cloud (Auth + PostgreSQL) |
| 部署 | Vercel |
| CI/CD | GitHub Actions |

## 功能

- 登录 / 注册（Supabase Auth）
- Dashboard 首页（统计卡片 + 注册趋势折线图 + 角色分布柱状图）
- 用户管理（增删改查 + 搜索/筛选/分页）
- 公告管理（发布/编辑/启用禁用/删除）
- 操作日志（查看系统操作记录，支持搜索分页）
- 设置（个人资料编辑 + 修改密码）

## 项目结构

```
full-stack-demo/
├── apps/web/          # Next.js 主应用
├── packages/ui/       # 共享 UI 组件
├── packages/utils/    # 共享工具函数
└── supabase/          # 数据库迁移 SQL
```

## 本地开发

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp apps/web/.env.example apps/web/.env.local
# 填入你的 Supabase 项目 URL 和 Key
```

### 3. 初始化数据库

在 [Supabase SQL Editor](https://app.supabase.com) 中按顺序执行：

```
supabase/migrations/20260413000001_create_profiles.sql
supabase/migrations/20260414000001_create_announcements.sql
supabase/migrations/20260414000002_create_audit_logs.sql
supabase/migrations/20260414000003_create_files.sql
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 在 Vercel 导入项目

- Root Directory: `apps/web`
- Framework: Next.js
- 配置环境变量（参考 `.env.example`）

### 2. 配置 GitHub Secrets

| Secret | 说明 |
|--------|------|
| `VERCEL_TOKEN` | Vercel Account Settings → Tokens |
| `VERCEL_ORG_ID` | 运行 `vercel link` 后查看 `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | 同上 |

### 3. 推送到 main 分支触发自动部署

```bash
git push origin main
```

## Supabase 配置

在 Supabase Dashboard → Authentication → URL Configuration 中添加：

- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/api/auth/callback`
