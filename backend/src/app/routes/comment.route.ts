import { Router } from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { requireWorkspaceMember } from "../middlewares/workspace.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { commentSchema } from "../validations/comment.validation.js";
import { requireProjectId } from "../middlewares/project.middleware.js";
import { requireIssueId } from "../middlewares/issue.middleware.js";

export const commentRouter: Router = Router();

const commentController = new CommentController();

commentRouter
  .route("/:workspaceId/projects/:projectId/issues/:issueId/comments")
  .post(
    restrictUserMiddleware(),
    validateBody(commentSchema),
    requireWorkspaceMember(),
    requireProjectId(),
    requireIssueId(),
    commentController.handlePostComments.bind(commentController),
  )
  .get(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireProjectId(),
    requireIssueId(),
    commentController.handleGetComment.bind(commentController),
  );

commentRouter.delete(
  "/:workspaceId/projects/:projectId/issues/:issueId/comments/:commentId",
  restrictUserMiddleware(),
  requireWorkspaceMember(),
  requireProjectId(),
  requireIssueId(),
  commentController.handleDeleteCommentById.bind(commentController),
);
