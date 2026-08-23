import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import {
  addWorkspaceMember,
  addWorkspaceMemberRole,
  worksSpaceSchema,
} from "../validations/workspace.validation.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  requireMemberId,
  requireWorkspaceAdmin,
  requireWorkspaceMember,
} from "../middlewares/Workspace.middleware.js";

export const workspaceRouter: Router = Router();
const workspaceController = new WorkspaceController();

workspaceRouter.post(
  "/create",
  restrictUserMiddleware(),
  validateBody(worksSpaceSchema),
  workspaceController.handleCreateWorkspace.bind(workspaceController),
);
workspaceRouter.get(
  "/",
  restrictUserMiddleware(),
  workspaceController.handleGetMyAllWorkspace.bind(workspaceController),
);
workspaceRouter.get(
  "/:workspaceId",
  restrictUserMiddleware(),
  requireWorkspaceMember(),
  workspaceController.handleGetOneWorkspace.bind(workspaceController),
);
workspaceRouter
  .route("/:workspaceId/members")
  .get(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    workspaceController.handleGetListMembers.bind(workspaceController),
  )
  .post(
    restrictUserMiddleware(),
    validateBody(addWorkspaceMember),
    requireWorkspaceMember(),
    requireWorkspaceAdmin(),
    workspaceController.handlePostAddMember.bind(workspaceController),
  );

workspaceRouter
  .route("/:workspaceId/members/:memberId")
  .patch(
    validateBody(addWorkspaceMemberRole),
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireWorkspaceAdmin(),
    requireMemberId(),
    workspaceController.handlePatchChangeMemberRole.bind(workspaceController),
  )
  .delete(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireWorkspaceAdmin(),
    requireMemberId(),
    workspaceController.handleDeleteMember.bind(workspaceController),
  );
