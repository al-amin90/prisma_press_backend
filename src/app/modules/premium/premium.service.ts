import type { PostWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";
import type { IPostQuery } from "../post/post.interface";

const getPremiumContent = async (query: IPostQuery) => {
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
    isPremium: true,
  });

  const result = await prisma.post.findMany({
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

export const premiumServices = {
  getPremiumContent,
};
