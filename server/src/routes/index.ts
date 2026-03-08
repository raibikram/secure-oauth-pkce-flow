import { Router } from "express";
import authRouter from "./auth.route";
const router: Router = Router();

// Auth routes
router.use("/auth", authRouter);


export default router;
