import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";
import config from "./app/config";
import userRouter from "./app/modules/user/user.route";
import GlobalErrorHandler from "./app/middlewares/GlobalErrorHandler";
import NotFound from "./app/middlewares/NotFound";
import { authRouter } from "./app/modules/auth/auth.route";
import { commentRouter } from "./app/modules/comment/comment.route";
import { postRouter } from "./app/modules/post/post.route";
import subscriptionRouter from "./app/modules/subscription/subscription.route";
import { stripe } from "./lib/stripe";
import premiumRouter from "./app/modules/premium/premium.route";

const app: Application = express();

app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

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
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/premium", premiumRouter);

app.get("/", (req, res) => {
  res.send(`This app listening on port ${3000}`);
});

app.use(GlobalErrorHandler);
app.use(NotFound);

export default app;
