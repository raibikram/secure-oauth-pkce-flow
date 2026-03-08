import mongoose from "mongoose";
import app from "./app";
import { env } from "./configs/env";
import connectDB from "./configs/db.config";
import { logger } from "./utils/logger";

async function startServer() {
    try {
        await connectDB();
        const PORT = env.port ?? 5000;

        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on: http://localhost:${PORT} in ${env.nodeEnv} mode`);
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string) => {
            logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                logger.info("HTTP server closed.");
                try {
                    await mongoose.connection.close();
                    logger.info("Database connection closed.");
                    process.exit(0);
                } catch (err) {
                    logger.error("Error during database disconnection:", err);
                    process.exit(1);
                }
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error("Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 10000);
        };

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();