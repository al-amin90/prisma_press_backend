import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";
import config from "./app/config";
import userRouter from "./app/modules/user/user.route";
import GlobalErrorHandler from "./app/middlewares/GlobalErrorHandler";
import NotFound from "./app/middlewares/NotFound";
import { authRouter } from "./app/modules/auth/auth.route";

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
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send(`This app listening on port ${3000}`);
});

app.use(GlobalErrorHandler);
app.use(NotFound);

export default app;
