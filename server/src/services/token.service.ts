
import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../configs/env";
import { getCookieConfig } from "../utils/cookieConfig";
import {
    ACCESS_TOKEN_EXPIRY_JWT,
    REFRESH_TOKEN_EXPIRY_JWT,
    REFRESH_TOKEN_EXPIRY_MS,
    ACCESS_TOKEN_EXPIRY_MS,
} from "../constants/constant";
import { ITokenPayload, IUser } from "../types";


export class TokenService {
    static generateAccessToken(user: Omit<IUser, "password">): string {
        const payload: ITokenPayload = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role ?? "USER",
        };
        return jwt.sign(payload, env.jwtSecret!, { expiresIn: ACCESS_TOKEN_EXPIRY_JWT } as jwt.SignOptions);
    }

    static generateRefreshToken(userId: string): string {
        return jwt.sign({ _id: userId }, env.jwtRefreshSecret!, {
            expiresIn: REFRESH_TOKEN_EXPIRY_JWT,
        } as jwt.SignOptions);
    }

    static verifyAccessToken(token: string): ITokenPayload {
        return jwt.verify(token, env.jwtSecret!) as ITokenPayload;
    }

    static verifyRefreshToken(token: string): { _id: string } {
        return jwt.verify(token, env.jwtRefreshSecret!) as { _id: string };
    }

    static setRefreshTokenCookie(res: Response, token: string): void {
        res.cookie(
            "refresh_token",
            token,
            getCookieConfig("/api/auth/refresh", REFRESH_TOKEN_EXPIRY_MS)
        );
    }

    static clearRefreshTokenCookie(res: Response): void {
        res.clearCookie("refresh_token", getCookieConfig("/api/auth/refresh", 0));
    }

    static setAccessTokenCookie(res: Response, token: string): void {
        res.cookie(
            "access_token",
            token,
            getCookieConfig("/", ACCESS_TOKEN_EXPIRY_MS)
        );
    }

    static clearAccessTokenCookie(res: Response): void {
        res.clearCookie("access_token", getCookieConfig("/", 0));
    }
}
