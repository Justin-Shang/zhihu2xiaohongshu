import express, { type Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// CORS：只允许 Replit Deploy 域名（上线后替换为实际域名）
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").filter(Boolean) || true;
app.use(cors({ credentials: true, origin: allowedOrigins }));

// Body 大小限制
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Rate Limiting：API 路由限频
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟窗口
  max: 30,             // 每个 IP 每分钟最多 30 次请求
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "请求过于频繁，请稍后再试" },
});
app.use("/api", apiLimiter);

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

export default app;
