import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/login", authControllers.loginUser);

// router.post("/change-password", authControllers.changePassword);

// router.post("/refresh-token", authControllers.refreshToken);

export const authRouter = router;
