import { Router, type Router as RouterType } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: RouterType = Router();

// OAuth initiation — redirects to Google consent screen
router.get("/google", AuthController.googleLogin);

// OAuth callback — Google redirects here after user consent
router.get("/google/callback", AuthController.googleCallback);

// Protected — returns current user's profile
router.get("/me", authenticate, AuthController.getMe);

// Issue new access token from refresh token cookie
router.post("/refresh", AuthController.refreshToken);

// Logout — clears refresh token cookie
router.post("/logout", AuthController.logout);

export default router;
