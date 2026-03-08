import { generateState, generateCodeVerifier, decodeIdToken } from "arctic";
import { Request, Response } from "express";
import { google } from "../configs/google";
import { env } from "../configs/env";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { IGoogleUserInfo, IUser } from "../types";
import User from "../models/user/user.model";
import { COOKIE_CONFIG, getCookieConfig } from "../utils/cookieConfig";



export class AuthController {
    /**
     * Step 1 — Initiate Google OAuth flow.
     * Generates PKCE state + verifier, stores in cookies, redirects to Google.
     */
    static googleLogin = asyncHandler(async (req: Request, res: Response) => {
        if (req?.user) {
            return res.redirect(env.frontendUrl);
        }

        const state = generateState();
        const codeVerifier = generateCodeVerifier(); // Used for PKCE

        const url = google.createAuthorizationURL(state, codeVerifier, [
            "openid",
            "profile",
            "email",
        ]);

        res.cookie("google_oauth_state", state, COOKIE_CONFIG);
        res.cookie("google_oauth_code_verifier", codeVerifier, COOKIE_CONFIG); // Fixed typo

        return res.redirect(url.toString());
    });

    /**
     * Step 2 — Handle Google OAuth callback.
     * Validates state/CSRF, exchanges code for tokens, fetches user profile,
     * upserts user + auth records, issues JWT access + refresh tokens.
     */
    static googleCallback = asyncHandler(async (req: Request, res: Response) => {
        const { code, state } = req.query as { code: string; state: string };
        const storedState = req.cookies["google_oauth_state"];
        const codeVerifier = req.cookies["google_oauth_code_verifier"];

        // CSRF validation
        if (!code || !state || !storedState || state !== storedState) {
            console.error("[Google OAuth Callback] CSRF Validation Failed", {
                code: !!code,
                stateReceived: state,
                storedState: storedState,
            });
            res.status(400).json({ success: false, message: "Invalid OAuth state. Possible CSRF attack." });
            return;
            // return res.redirect(`${env.frontendUrl}/login`);
        }

        if (!codeVerifier) {
            console.error("[Google OAuth Callback] Missing PKCE Verifier");
            res.status(400).json({ success: false, message: "Missing PKCE code verifier." });
            return;
        }

        // Exchange authorization code for Google tokens
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);

        const googleUser = decodeIdToken(tokens.idToken()) as IGoogleUserInfo;
        // const { sub, name, email, picture,email_verified } = googleUser;


        // // Fetch user profile from Google's userinfo endpoint
        // const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        //     headers: { Authorization: `Bearer ${tokens.accessToken()}` },
        // });

        // if (!userInfoResponse.ok) {
        //     res.status(502).json({ success: false, message: "Failed to fetch user info from Google." });
        //     return;
        // }

        // const googleUser = (await userInfoResponse.json()) as IGoogleUserInfo;

        // if (!googleUser.email_verified) {
        //     res.status(400).json({ success: false, message: "Google account email is not verified." });
        //     return;
        // }
        // const googleUser: IGoogleUserInfo = {
        //     sub: googleId,
        //     name,
        //     email,
        //     picture,
        //     email_verified
        // };
        // Find or create user and link Auth record
        const user = await AuthService.findOrCreateUserFromGoogle(googleUser);

        // Issue JWT tokens
        const accessToken = TokenService.generateAccessToken(user as IUser);
        const refreshToken = TokenService.generateRefreshToken(user._id.toString());

        // Clear the OAuth exchange cookies
        res.clearCookie("google_oauth_state", getCookieConfig("/", 0));
        res.clearCookie("google_oauth_code_verifier", getCookieConfig("/", 0));

        // Set tokens as HTTP-only cookies
        TokenService.setRefreshTokenCookie(res, refreshToken);
        TokenService.setAccessTokenCookie(res, accessToken);

        // Redirect to frontend callback page
        return res.redirect(`${env.frontendUrl}/callback`);
    });

    /**
     * GET /api/auth/me — Returns the currently authenticated user's profile.
     * Protected by `authenticate` middleware.
     */
    static getMe = asyncHandler(async (req: Request, res: Response) => {
        const user = await User.findById(req.user!._id)
            .select("-password")
            .lean();

        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        res.json({ success: true, user });
    });

    /**
     * POST /api/auth/refresh — Issues a new access token using the refresh token cookie.
     */
    static refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const token = req.cookies["refresh_token"];

        if (!token) {
            res.status(401).json({ success: false, message: "No refresh token provided." });
            return;
        }

        const payload = TokenService.verifyRefreshToken(token);

        const user = await User.findById(payload._id).select("-password").lean();
        if (!user) {
            res.status(401).json({ success: false, message: "User not found." });
            return;
        }


        const accessToken = TokenService.generateAccessToken(user as IUser);
        TokenService.setAccessTokenCookie(res, accessToken);

        res.json({ success: true, accessToken });
    });

    /**
     * POST /api/auth/logout — Clears the refresh token cookie.
     */
    static logout = asyncHandler(async (_req: Request, res: Response) => {
        TokenService.clearRefreshTokenCookie(res);
        TokenService.clearAccessTokenCookie(res);
        res.json({ success: true, message: "Logged out successfully." });
    });
}
