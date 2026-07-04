/* eslint-disable @typescript-eslint/no-unused-vars */

import sendResponse from "../../utils/sendResponse";
import type { Request, Response } from "express";
import { postServices } from "./post.service";
import { Role } from "../../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  const result = await postServices.createPost(
    req.body,
    req.user?.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post created successfully",
    data: result,
  });
};

const getAllPosts = async (req: Request, res: Response) => {
  const result = await postServices.getAllPosts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All posts retrieved successfully",
    data: result,
  });
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  if (!postId) {
    throw new Error("Post ID is required");
  }
  const result = await postServices.getPostById(postId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "posts retrieved Successfully",
    data: result,
  });
};

// const getPostsStats = async (req: Request, res: Response) => {
//   const result = await postServices.loginUser(req.body);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "User is logged in Successfully",
//     data: {},
//   });
// };

const getMyPosts = async (req: Request, res: Response) => {
  const result = await postServices.getMyPosts(req.user?.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Author posts retrieved Successfully",
    data: result,
  });
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  if (!postId) {
    throw new Error("Post ID is required");
  }

  const result = await postServices.updatePost(
    postId as string,
    req.body,
    req.user?.id as string,
    req.user?.role === Role.ADMIN,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post updated successfully",
    data: result,
  });
};

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  if (!postId) {
    throw new Error("Post ID is required");
  }

  await postServices.deletePost(
    postId as string,
    req.user?.id as string,
    req.user?.role === Role.ADMIN,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post Deleted Successfully",
    data: null,
  });
};

export const postControllers = {
  createPost,
  getAllPosts,
  // getPostsStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
