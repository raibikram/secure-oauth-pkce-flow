import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import morgan from "morgan";
import { env } from "./configs/env";
import helmet from "helmet";
import routes from "./routes";
import { limiter } from "./utils/rateLimiter";

const app: Express = express();

app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Security headers
app.use(helmet());

app.use(limiter);

app.use(cookieParser()); // Required to read req.cookies

app.use(
    cors({
        origin: env.corsOrigin,
        credentials: true, // Required for cookies (refresh token)
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    })
);

// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Centralized API routes
app.use("/api", routes);

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
