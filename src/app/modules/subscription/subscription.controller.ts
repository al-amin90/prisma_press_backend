import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { subscriptionServices } from "./subscription.service";
import { stripe } from "../../../lib/stripe";
import config from "../../config";

const createCheckoutSession = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await subscriptionServices.createCheckoutSession(
    userId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Successfully",
    data: { paymentUrl: result },
  });
};

const handlerWebHook = async (req: Request, res: Response) => {
  const event = req.body;
  const signature = req.headers["stripe-signature"]!;

  const result = await subscriptionServices.handlerWebHook(
    event,
    signature as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook trigger Successfully",
    data: null,
  });
};

const getSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await subscriptionServices.getSubscriptionStatus(
    userId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription status retrived Successfully",
    data: result,
  });
};

export const subscriptionController = {
  createCheckoutSession,
  handlerWebHook,
  getSubscriptionStatus,
};
