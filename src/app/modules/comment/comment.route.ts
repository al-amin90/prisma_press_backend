import { Router } from "express";
import { commentController } from "./comment.controller";
import { Role } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.createComment,
);

router.get(
  "/author/:authorId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.getCommentByAuthorId,
);

router.get("/:postId", commentController.getCommentByPostId);

router.patch(
  "/:commentId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.updateComment,
);

router.delete(
  "/:commentId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  commentController.deleteComment,
);

router.patch(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.moderateComment,
);

export const commentRouter = router;
