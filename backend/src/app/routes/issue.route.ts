import { Router } from "express";
import { IssueController } from "../controllers/issue.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  issueSchema,
  patchIssueSchema,
} from "../validations/issue.validation.js";
import { requireWorkspaceMember } from "../middlewares/workspace.middleware.js";
import { requireProjectId } from "../middlewares/project.middleware.js";
import { requireIssueId } from "../middlewares/issue.middleware.js";

export const issueRouter: Router = Router();
const issueController = new IssueController();

issueRouter
  .route("/:workspaceId/projects/:projectId/issues")
  .post(
    restrictUserMiddleware(),
    validateBody(issueSchema),
    requireWorkspaceMember(),
    requireProjectId(),
    issueController.handlePostcreateIssue.bind(issueController),
  )
  .get(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireProjectId(),
    issueController.handleGetIssueFilter.bind(issueController),
  );
issueRouter
  .route("/:workspaceId/projects/:projectId/issues/:issueId")
  .get(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireProjectId(),
    requireIssueId(),
    issueController.handleGetIssueById.bind(issueController),
  )
  .patch(
    restrictUserMiddleware(),
    validateBody(patchIssueSchema),
    requireWorkspaceMember(),
    requireProjectId(),
    requireIssueId(),
    issueController.handlePatchIssueById.bind(issueController),
  )
  .delete(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireProjectId(),
    requireIssueId(),
    issueController.handleDeleteIssueById.bind(issueController),
  );
issueRouter.get(
  "/:workspaceId/projects/:projectId/issues/:issueId/activity",
  restrictUserMiddleware(),
  requireWorkspaceMember(),
  requireProjectId(),
  requireIssueId(),
  issueController.handleGetIssueActivity.bind(issueController),
);
