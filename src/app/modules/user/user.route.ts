import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/me", auth(), userController.getMyProfile);

const userRouter = router;
export default userRouter;
