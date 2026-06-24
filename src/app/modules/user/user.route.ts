import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/me", auth(Role.ADMIN, Role.USER), userController.getMyProfile);

const userRouter = router;
export default userRouter;
