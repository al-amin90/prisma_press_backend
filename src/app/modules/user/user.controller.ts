import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const { user } = await userServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Created Successfully",
    data: { user },
  });
};

const getMyProfile = async (req: Request, res: Response) => {
  const { user } = await userServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Created Successfully",
    data: { user },
  });
};

export const userController = {
  createUser: registerUser,
};
