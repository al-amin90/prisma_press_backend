import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/AppError";
import config from "../../config";

type IUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "manager" | "super_admin";
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
    },
  });
  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

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

export const userServices = {
  registerUserIntoDB,
};
