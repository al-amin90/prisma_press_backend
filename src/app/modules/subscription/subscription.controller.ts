import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { subscriptionServices } from "./subscription.service";

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

export const subscriptionController = {
  createCheckoutSession,
};
