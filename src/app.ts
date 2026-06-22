import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";
import config from "./app/config";
import sendResponse from "./app/utils/sendResponse";
import { prisma } from "./lib/prisma";
import AppError from "./app/utils/AppError";
import bcrypt from "bcryptjs";

const app: Application = express();

// __) parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "x-tenant",
    ],
    exposedHeaders: ["Authorization"],
  }),
);

// __) all application route here
// app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send(`This app listening on port ${3000}`);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, profilePhoto } = req.body;

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

  const data = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: { password: true },
    include: {
      profile: true,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "register successfully",
    data,
  });
});

// app.use(GlobalErrorHandler);
// app.use(NotFound);

export default app;
