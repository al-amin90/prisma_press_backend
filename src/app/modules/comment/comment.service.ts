import type { CommentStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

const createComment = async (
  authorId: string,
  payload: { content: string; postId: string },
) => {
  const { content, postId } = payload;

  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      authorId,
      content,
      postId,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const moderateComment = async (
  userId: string,
  id: string,
  payload: { status: CommentStatus },
) => {
  const { status } = payload;

  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (userId !== comment.authorId) {
    throw new Error(" no cheating");
  }
  if (comment.status === payload.status) {
    throw new Error("The Status is same");
  }

  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  return result;
};

const getCommentByPostId = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      postId,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const updateComment = async (
  userId: string,
  id: string,
  payload: { content: string },
) => {
  const { content } = payload;

  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (userId !== comment.authorId) {
    throw new Error(" no cheating");
  }

  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });

  return result;
};

const deleteComment = async (userId: string, id: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (userId !== comment.authorId) {
    throw new Error(" no cheating");
  }

  await prisma.comment.delete({
    where: {
      id,
    },
  });
};

export const commentService = {
  createComment,
  moderateComment,
  getCommentByAuthorId,
  getCommentByPostId,
  updateComment,
  deleteComment,
};
