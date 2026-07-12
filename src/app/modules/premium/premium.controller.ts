import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { premiumServices } from "./premium.service";

const getPremiumContent = catchAsync(async (req: Request, res: Response) => {
  const result = await premiumServices.getPremiumContent(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Premium Content Retrived Successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const premiumController = {
  getPremiumContent,
};
