import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { worksSpaceSchema } from "../validations/workspace.validation.js";
import { validateBody } from "../middlewares/validate.middleware.js";

export const workspaceRouter: Router = Router();
const workspaceController = new WorkspaceController();

workspaceRouter.post(
  "/create",
  restrictUserMiddleware(),
  validateBody(worksSpaceSchema),
  workspaceController.handleCreateWorkspace.bind(workspaceController),
);
