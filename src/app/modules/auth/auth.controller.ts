/* eslint-disable @typescript-eslint/no-unused-vars */

import { authServices } from "./auth.service";
import config from "../../config";
import sendResponse from "../../utils/sendResponse";
import type { NextFunction, Request, Response } from "express";

const loginUser = async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  // const { refreshToken, accessToken, needsPasswordChange } = result;

  // res.cookie("refreshToken", refreshToken, {
  //   secure: config.node_env === "production",
  //   httpOnly: true,
  // });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {
      user: result.user,
      // accessToken,
      // needsPasswordChange,
    },
  });
};

// const changePassword = async (req, res, next) => {
//   const result = await authServices.changePassword(req.user, req.body);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Password change Successfully",
//     data: [],
//   });
// };

// const refreshToken = async (req, res, next) => {
//   const { refreshToken } = req.cookies;

//   const result = await authServices.refreshToken(refreshToken);
//   const { accessToken } = result;

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Access Token Retrieved Successfully",
//     data: {
//       accessToken,
//     },
//   });
// };

export const authControllers = {
  loginUser,
  // changePassword,
  // refreshToken,
};
