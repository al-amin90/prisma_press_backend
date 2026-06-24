import type { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../../../generated/prisma/enums";
import AppError from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name: Role;
      };
    }
  }
}

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.access_token,
    ) as JwtPayload;

    const { id, email, role, name } = verifiedToken;

    const roles = ["ADMIN"];

    if (!roles.includes(role)) {
      throw new AppError(403, "You are not authorized!");
    }

    req.user = {
      id,
      email,
      role,
      name,
    };

    next();
  };
};

export default auth;
