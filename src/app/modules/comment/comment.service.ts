import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import AppError from "../../utils/AppError";
import type { TLoginUser } from "./comment.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
import { ActiveStatus } from "../../../../generated/prisma/enums";

const createComment = async () => {};

const moderateComment = async () => {};

const getCommentByAuthorId = async () => {};

const getCommentById = async () => {};

const updateComment = async () => {};

const deleteComment = async () => {};
export const commentService = {
  createComment,
  moderateComment,
  getCommentByAuthorId,
  getCommentById,
  updateComment,
  deleteComment,
};
