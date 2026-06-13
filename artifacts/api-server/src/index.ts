import app from "./app";
import { logger } from "./lib/logger";

// ============ 启动时校验必需环境变量 ============
const REQUIRED_ENV_VARS = [
  { name: "DEEPSEEK_API_KEY", or: "OPENAI_API_KEY", label: "LLM API Key" },
  { name: "ZHIHU_API_TOKEN", label: "知乎 API Token" },
  { name: "CLERK_PUBLISHABLE_KEY", label: "Clerk Publishable Key" },
  { name: "CLERK_SECRET_KEY", label: "Clerk Secret Key" },
];

const missingVars: string[] = [];
for (const v of REQUIRED_ENV_VARS) {
  const hasPrimary = !!process.env[v.name];
  const hasFallback = v.or ? !!process.env[v.or] : false;
  if (!hasPrimary && !hasFallback) {
    const hint = v.or ? `（或 ${v.or}）` : "";
    missingVars.push(`  - ${v.name} ${hint} — ${v.label}`);
  }
}

if (missingVars.length > 0) {
  logger.warn("缺少以下环境变量，部分功能不可用：");
  for (const m of missingVars) {
    logger.warn(m);
  }
  // 如果没有 LLM API Key，服务启动没有意义
  const hasLlmKey = !!process.env.DEEPSEEK_API_KEY || !!process.env.OPENAI_API_KEY;
  if (!hasLlmKey) {
    logger.error("未配置 LLM API Key（DEEPSEEK_API_KEY 或 OPENAI_API_KEY），服务退出");
    process.exit(1);
  }
}

// ============ 启动服务器 ============
const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
