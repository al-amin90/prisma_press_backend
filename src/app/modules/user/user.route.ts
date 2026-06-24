import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.createUser);
router.post("/me", userController.getMyProfile);

const userRouter = router;
export default userRouter;
