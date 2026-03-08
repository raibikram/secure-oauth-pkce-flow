import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().default("8000"),
    MONGODB_URL: z.string().url("Must be a valid MongoDB connection string"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    JWT_SECRET: z.string().min(10, "JWT Secret must be at least 10 characters"),
    JWT_REFRESH_SECRET: z.string().min(10, "JWT Refresh Secret must be at least 10 characters"),
    CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.string().url(),
    FRONTEND_URL: z.string().url().default("http://localhost:3000"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1);
}

const envVars = parsedEnv.data;

export const env = Object.freeze({
    port: envVars.PORT,
    databaseUrl: envVars.MONGODB_URL,
    nodeEnv: envVars.NODE_ENV,
    jwtSecret: envVars.JWT_SECRET,
    jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
    corsOrigin: envVars.CORS_ORIGIN,
    googleClientId: envVars.GOOGLE_CLIENT_ID,
    googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: envVars.GOOGLE_REDIRECT_URI,
    frontendUrl: envVars.FRONTEND_URL,
});
