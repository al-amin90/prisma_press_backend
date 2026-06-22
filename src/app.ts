import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";
import config from "./app/config";
import sendResponse from "./app/utils/sendResponse";
import { prisma } from "./lib/prisma";
import AppError from "./app/utils/AppError";
import bcrypt from "bcryptjs";
import userRouter from "./app/modules/user/user.route";

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
app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send(`This app listening on port ${3000}`);
});

// app.use(GlobalErrorHandler);
// app.use(NotFound);

export default app;
