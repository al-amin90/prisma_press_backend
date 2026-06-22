import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const { user } = await userServices.registerUserIntoDB(req.body);

  //   res.cookie("refreshToken", refreshToken, {
  //     secure: false,
  //     httpOnly: true,
  //     sameSite: "lax",
  //   });

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
