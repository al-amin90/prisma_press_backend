import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { premiumController } from "./premium.controller";
import subscriptionGuard from "../../middlewares/premiumGuard";

const router = Router();

router.get(
  "/",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  subscriptionGuard(),
  premiumController.getPremiumContent,
);

const premiumRouter = router;
export default premiumRouter;
