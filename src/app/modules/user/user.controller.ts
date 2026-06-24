import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import AppError from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import type { JwtPayload } from "jsonwebtoken";

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
  // const { accessToken } = req.cookies;

  // const verifiedToken = jwtUtils.verifyToken(
  //   accessToken,
  //   config.access_token,
  // ) as JwtPayload;

  const result = await userServices.getUserFromDB(req.user?.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Info Get Successfully",
    data: result,
  });
};

export const userController = {
  registerUser,
  getMyProfile,
};
