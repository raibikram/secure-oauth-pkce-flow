import winston from "winston";
import { env } from "../configs/env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
    level: env.nodeEnv === "development" ? "debug" : "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        env.nodeEnv === "development" ? colorize() : winston.format.uncolorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
        // In production, you might also add File transports or external services like Datadog:
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});
