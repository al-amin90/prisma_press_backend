import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { premiumServices } from "./premium.service";

const getPremiumContent = async (req: Request, res: Response) => {
  const result = await premiumServices.getPremiumContent();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Premium Content Retrived Successfully",
    data: result,
  });
};

export const premiumController = {
  getPremiumContent,
};
