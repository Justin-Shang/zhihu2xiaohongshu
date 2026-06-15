# zhihu2xiaohongshu 📝→📱

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C8?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**知乎专栏/回答/想法 → 小红书笔记智能转换工具**

一键把知乎上的深度内容转成小红书爆款笔记风格。支持三种知乎内容源 + 三种笔记风格。

## 功能

- **三种输入方式**：
  - 🔗 知乎链接（专栏/回答/想法）
  - 📋 粘贴文章文本
  - 🔖 书签小工具（Bookmarklet）：在知乎页面点一下自动抓取内容
- **三种输出风格**：
  - 📚 干货总结型 — 要点罗列，适合收藏
  - 💡 观点争议型 — 有态度的分享，激发讨论
  - 🛠 实操教程型 — 手把手教学，适合种草
- **支持三种知乎内容类型**：专栏文章、问题回答、想法（Pin）
- **一键复制**：生成后可直接复制到小红书发布

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + Vite + TypeScript 5.9 |
| 样式 | Tailwind CSS + shadcn/ui + Framer Motion |
| 认证 | Clerk（邮箱/Google 登录） |
| 后端 | Express 5 + OpenAI SDK |
| 知乎 API | 知乎 v4 移动端 API |
| LLM | DeepSeek / OpenAI 兼容 API |
| 包管理 | pnpm workspaces (monorepo) |

## 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 DEEPSEEK_API_KEY / CLERK_* 等

# 启动 API 服务器
pnpm --filter @workspace/api-server run dev

# 启动前端（另一个终端）
pnpm --filter @workspace/zhihu2xiaohongshu run dev
```

### 必需环境变量

| 变量 | 说明 |
|------|------|
| `DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY` | LLM API Key |
| `ZHIHU_API_TOKEN` | 知乎 API OAuth Token |
| `CLERK_PUBLISHABLE_KEY` | Clerk 公钥（前端用） |
| `CLERK_SECRET_KEY` | Clerk 密钥（后端用） |
| `DATABASE_URL` | PostgreSQL 连接串（可选） |

## 项目结构

```
zhihu2xiaohongshu/
├── artifacts/
│   ├── api-server/          # Express API 服务器
│   │   └── src/
│   │       ├── routes/
│   │       │   └── convert.ts    # 核心：知乎提取 + LLM 生成
│   │       ├── app.ts            # Express 配置
│   │       └── index.ts          # 启动入口
│   ├── zhihu2xiaohongshu/   # React 前端
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── home.tsx      # 主转换页面
│   │       │   └── landing.tsx   # 着陆页
│   │       └── components/       # UI 组件
│   ├── api-spec/            # OpenAPI 规范
│   ├── api-zod/             # Zod 校验定义
│   ├── api-client-react/    # 前端 API 客户端
│   └── mockup-sandbox/      # 原型沙箱
├── lib/                     # 共享库
└── scripts/                 # 构建/部署脚本
```

## 安全

- 🔒 所有 API 请求需 Clerk 登录认证
- 🛡️ Prompt 反注入防御
- ⏱️ Rate Limiting 防滥用
- 🔐 知乎 API Token 通过环境变量传入，不写死在代码里
- 📏 Request body 大小限制 1MB
- ✅ 启动时校验必需环境变量

## 部署

Replit Deploy 自动部署。生产环境需配置：
1. `ALLOWED_ORIGINS` — 允许的前端域名（逗号分隔）
2. 所有必需环境变量

## License

[MIT](LICENSE)
