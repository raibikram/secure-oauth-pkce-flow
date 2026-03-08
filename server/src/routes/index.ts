import { Router } from "express";
import authRouter from "./auth.route";
const router: Router = Router();

// Auth routes
router.use("/auth", authRouter);

// Add other feature routes here as the application grows:
// router.use("/products", productRouter);

export default router;
