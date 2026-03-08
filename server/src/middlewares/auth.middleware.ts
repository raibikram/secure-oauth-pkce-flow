import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/token.service";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // Read access token from cookies
    const token = req.cookies.access_token ||
        (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null);

    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        return;
    }

    try {
        const payload = TokenService.verifyAccessToken(token);
        req.user = {
            _id: payload._id,
            name: payload.name,
            email: payload.email,
            role: payload.role as "ADMIN" | "USER",
        };
        next();
    } catch {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
    }
};
