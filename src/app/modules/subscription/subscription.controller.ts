import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { subscriptionServices } from "./subscription.service";

const createCheckoutSession = async (req: Request, res: Response) => {
  const { user } = await subscriptionServices.createCheckoutSession(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Created Successfully",
    data: { user },
  });
};

export const subscriptionController = {
  createCheckoutSession,
};
