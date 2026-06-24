import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import AppError from "../../utils/AppError";
import type { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  // if (user.status === "blocked") {
  //   throw new AppError(status.FORBIDDEN, "The User is Blocked");
  // }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(403, "Password do not match");
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
  };

  // const accessToken = createToken(
  //   jwtPayload,
  //   config.jwt_access_token as string,
  //   config.jwt_access_expires_in as string,
  // );

  // const refreshToken = createToken(
  //   jwtPayload,
  //   config.jwt_refresh_token as string,
  //   config.jwt_refresh_expires_in as string,
  // );

  return {
    // accessToken,
    // refreshToken,
    user,
  };
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
  // refreshToken,
};
