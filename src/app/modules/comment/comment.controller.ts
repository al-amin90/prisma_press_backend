/* eslint-disable @typescript-eslint/no-unused-vars */

import config from "../../config";
import sendResponse from "../../utils/sendResponse";
import type { Request, Response } from "express";

const createComment = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {},
  });
};

const moderateComment = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {},
  });
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {},
  });
};

const getCommentById = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {},
  });
};

const updateComment = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {},
  });
};

const deleteComment = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: {},
  });
};

export const commentController = {
  createComment,
  moderateComment,
  getCommentByAuthorId,
  getCommentById,
  updateComment,
  deleteComment,
};
