import { CommentStatus, PostStatus } from "../../../../generated/prisma/enums";
import type { PostWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/AppError";
import type { ICreatePostPayload, IPostQuery } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (payload.isPremium && user.subscription?.status !== "ACTIVE") {
    throw new Error(
      "You are not Premium user. You cant create premium content",
    );
  }
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andCondition: PostWhereInput[] = [];

  if (query.searchTerm) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andCondition.push({ title: query.title });
  }
  if (query.content) {
    andCondition.push({ content: query.content });
  }
  if (query.status) {
    andCondition.push({ status: query.status });
  }
  if (query.isFeatured) {
    andCondition.push({ isFeatured: query.isFeatured });
  }
  if (query.authorId) {
    andCondition.push({ authorId: query.authorId });
  }
  if (query.tags) {
    andCondition.push({
      tags: {
        hasSome: JSON.parse(query.tags as string),
      },
    });
  }

  andCondition.push({
    isPremium: false,
  });

  const result = await prisma.post.findMany({
    // searching & filtering combain
    // where: {
    //   AND: [
    //     // searching
    //     {
    //       OR: [
    //         {
    //           title: {
    //             contains: "Ro",
    //             mode: "insensitive",
    //           },
    //         },
    //         {
    //           content: {
    //             contains: "ro",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     // filtering
    //     // {
    //     //   title: "Cris Ronaldo",
    //     // },
    //     {
    //       content: "Ronaldo",
    //     },
    //   ],
    // },
    // take: 1, // limit
    // skip: 2, // skip

    where: {
      AND: andCondition,
    },

    // pagination
    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  const totalCount = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total: totalCount,
      totalPage: Math.ceil(totalCount / limit),
    },
  };
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
        isPremium: false,
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

const getPostsStats = async () => {
  const transitionResult = await prisma.$transaction(async (tx) => {
    // const totalPost = await tx.post.count();
    // const totalPublishedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });
    // const totalDraftPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArchivedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalComments = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECTED,
    //   },
    // });

    // not a good approach
    // const allPost = await tx.post.findMany();
    // let postViews = 0;
    // allPost.forEach((post) => {
    //   postViews += post.views;
    // });

    // const allPostViews = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    const [
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      postViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      postViews: postViews._sum.views,
    };
  });

  return transitionResult;
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
