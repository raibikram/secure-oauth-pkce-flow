
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
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
    transports:
        env.nodeEnv === "development"
            ? [
                  new winston.transports.Console()
              ]
            : [
                  new DailyRotateFile({
                      filename: "logs/error-%DATE%.log",
                      datePattern: "YYYY-MM-DD",
                      level: "error",
                      maxFiles: "14d",
                      zippedArchive: true,
                  }),
                  new DailyRotateFile({
                      filename: "logs/combined-%DATE%.log",
                      datePattern: "YYYY-MM-DD",
                      maxFiles: "14d",
                      zippedArchive: true,
                  })
              ],
});
