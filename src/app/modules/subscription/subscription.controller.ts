import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { subscriptionServices } from "./subscription.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
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
  },
);

const handlerWebHook = catchAsync(async (req: Request, res: Response) => {
  const event = req.body;
  const signature = req.headers["stripe-signature"]!;

  await subscriptionServices.handlerWebHook(event, signature as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook trigger Successfully",
    data: null,
  });
});

const getSubscriptionStatus = catchAsync(
  async (req: Request, res: Response) => {
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
  },
);

export const subscriptionController = {
  createCheckoutSession,
  handlerWebHook,
  getSubscriptionStatus,
};
