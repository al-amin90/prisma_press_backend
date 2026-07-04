import { CommentStatus } from "../../../../generated/prisma/enums";
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

const getPostById = async (postId: string) => {
  // await prisma.post.update({});
  // const post = await prisma.post.findUniqueOrThrow({});

  // return post;

  const transition = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },

      include: {
        author: {
          omit: {
            password: true,
          },
        },

        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },

          orderBy: {
            createdAt: "desc",
          },
        },

        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transition;
};

const getPostsStats = async (postId: string) => {
  return;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: Partial<ICreatePostPayload>,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new AppError(403, "You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new AppError(403, "You are not owner this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postServices = {
  createPost,
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
