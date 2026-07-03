import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/AppError";
import type { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const getPostsStats = async () => {};

const getMyPosts = async () => {
  const result = await authServices.loginUser(req.body);
};

const getPostById = async () => {
  const result = await authServices.loginUser(req.body);
};

const updatePost = async () => {};

const deletePost = async () => {};

export const postServices = {
  createPost,
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
