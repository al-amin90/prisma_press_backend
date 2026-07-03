import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import AppError from "../../utils/AppError";
import type { TLoginUser } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
import { ActiveStatus } from "../../../../generated/prisma/enums";

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.activeStatus === ActiveStatus.BLOCKED) {
    throw new AppError(403, "You are Blocked");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(403, "Password do not match");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.access_token,
    config.access_expires_in,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.refresh_token,
    config.refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    config.refresh_token,
  );

  console.log("verifiedToken", verifiedToken);

  const { id } = verifiedToken as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (user.activeStatus === ActiveStatus.BLOCKED) {
    throw new AppError(403, "You are Blocked");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.access_token,
    config.access_expires_in,
  );

  return { accessToken };
};

// const changePassword = async (
//   userData: JwtPayload,
//   payload: TChangePassword,
// ) => {
//   const user = await UserModel.isUserExistByCustomId(userData.id);

//   if (!user) {
//     throw new AppError(status.NOT_FOUND, "The User Does't exists");
//   }

//   const isDeleted = user.isDeleted;
//   if (isDeleted) {
//     throw new AppError(status.FORBIDDEN, "The User is Deleted");
//   }

//   if (user.status === "blocked") {
//     throw new AppError(status.FORBIDDEN, "The User is Blocked");
//   }

//   if (!(await UserModel.isPasswordMatch(payload.oldPassword, user.password))) {
//     throw new AppError(status.FORBIDDEN, "Password do not match");
//   }

//   const newPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   const result = await UserModel.findOneAndUpdate(
//     {
//       id: user.id,
//       role: user.role,
//     },
//     {
//       password: newPassword,
//       needsPasswordChange: false,
//       passwordChangeAt: new Date(),
//     },
//   );

//   return result;
// };

// const refreshToken = async (token: string) => {
//   const decoded = jwt.verify(token, config.jwt_refresh_token as string);
//   const { id, iat } = decoded as JwtPayload;

//   const user = await UserModel.isUserExistByCustomId(id);

//   if (!user) {
//     throw new AppError(status.NOT_FOUND, "The User Does't exists");
//   }

//   const isDeleted = user.isDeleted;
//   if (isDeleted) {
//     throw new AppError(status.FORBIDDEN, "The User is Deleted");
//   }

//   if (user.status === "blocked") {
//     throw new AppError(status.FORBIDDEN, "The User is Blocked");
//   }

//   if (
//     user.passwordChangeAt &&
//     (await UserModel.isJWTIssuedBeforePassword(
//       user.passwordChangeAt,
//       iat as number,
//     ))
//   ) {
//     throw new AppError(status.UNAUTHORIZED, "You are not authorized. by!");
//   }

//   const jwtPayload = {
//     id: user.id,
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_token as string,
//     config.jwt_access_expires_in as string,
//   );

//   return {
//     accessToken,
//   };
// };

export const authServices = {
  loginUser,
  // changePassword,
  refreshToken,
};
