import { CookieOptions } from "express";
import { env } from "../configs/env";
import { OAUTH_EXCHANEGE_EXPIRY } from "../constants/constant";

export const getCookieConfig = (path: string = "/", maxAge: number = OAUTH_EXCHANEGE_EXPIRY): CookieOptions => {
    const isProduction = env.nodeEnv === "production";
    
    return {
        httpOnly: true, // Prevents XSS attacks from reading the cookie
        secure: isProduction, // Requires HTTPS in production
        sameSite: isProduction ? "none" : "lax", // 'none' required for cross-domain cookies across different hosting
        maxAge: maxAge,
        path: path,
    };
};

export const COOKIE_CONFIG = getCookieConfig();