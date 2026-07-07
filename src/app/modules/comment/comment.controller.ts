/* eslint-disable @typescript-eslint/no-unused-vars */

import config from "../../config";
import sendResponse from "../../utils/sendResponse";
import type { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  const result = await commentService.createComment(
    req.user?.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment Post Successfully",
    data: result,
  });
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  const result = await commentService.getCommentByAuthorId(
    req.params.authorId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Author Comment Get Successfully",
    data: result,
  });
};

const getCommentById = async (req: Request, res: Response) => {
  const result = await commentService.getCommentById(
    req.params.commentId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in Successfully",
    data: result,
  });
};

const updateComment = async (req: Request, res: Response) => {
  const result = await commentService.updateComment(
    req.user?.id as string,
    req.params.commentId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment Updated Successfully",
    data: result,
  });
};

const moderateComment = async (req: Request, res: Response) => {
  const result = await commentService.updateComment(
    req.user?.id as string,
    req.params.commentId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment Status Change Successfully",
    data: result,
  });
};

const deleteComment = async (req: Request, res: Response) => {
  const result = await commentService.deleteComment(
    req.user?.id as string,
    req.params.commentId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment Deleted Successfully",
    data: result,
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
