import { Router } from "express";
import { IssueController } from "../controllers/issue.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { issueSchema } from "../validations/issue.validation.js";
import { requireWorkspaceMember } from "../middlewares/workspace.middleware.js";
import { requireProjectId } from "../middlewares/project.middleware.js";

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
    issueController.handleGetAllIssues.bind(issueController),
  );
