
import type { Request, Response, NextFunction } from "express";

import { logger } from "../utils/logger";

export const errorMiddleware = (
    err: unknown,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
) => {
    // Type guard for error object
    const error = err as { statusCode?: number; message?: string; stack?: string };
    logger.error(error.stack || error.message || error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};