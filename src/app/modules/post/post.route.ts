import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { postControllers } from "./post.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postControllers.createPost,
);

router.get("/", postControllers.getAllPosts);

router.get("/stats", auth(Role.ADMIN), postControllers.getPostsStats);

router.get(
  "/my-posts",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postControllers.getMyPosts,
);

router.get("/:postId", postControllers.getPostById);

router.patch(
  "/:postId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postControllers.updatePost,
);

router.delete(
  "/:postId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postControllers.deletePost,
);

export const postRouter = router;
