import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = await userServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Created Successfully",
    data: { user },
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
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
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateUserFromDB(
    req.user?.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile Updated Successfully",
    data: result,
  });
});

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
