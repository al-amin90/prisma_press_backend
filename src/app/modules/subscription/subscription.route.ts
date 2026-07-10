import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { subscriptionController } from "./subscription.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  subscriptionController.createCheckoutSession,
);

router.post("/webhook", subscriptionController.handlerWebHook);

const subscriptionRouter = router;
export default subscriptionRouter;
