import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/AppError";
import config from "../../config";
import type { Role } from "../../../../generated/prisma/enums";

type IUser = {
  name: string;
  email: string;
  password: string;
  role: Role;
  profilePhoto?: string | null;
};

const registerUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role, profilePhoto } = payload;

  const isExisted = await prisma.user.findUnique({
    where: { email },
  });

  if (isExisted) {
    throw new AppError(500, "user already exists");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });
  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto,
  //   },
  // });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: { password: true },
    include: {
      profile: true,
    },
  });
  return { user };
};

const getUserFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    omit: { password: true },
    include: {
      profile: true,
    },
  });
  return user;
};

const updateUserFromDB = async (id: string, payload: any) => {
  const { name, email, password, role, profilePhoto, bio } = payload;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,

      profile: {
        update: {
          bio,
          profilePhoto,
        },
      },
    },

    omit: { password: true },
    include: {
      profile: true,
    },
  });

  return updatedUser;
};

export const userServices = {
  registerUserIntoDB,
  getUserFromDB,
  updateUserFromDB,
};
