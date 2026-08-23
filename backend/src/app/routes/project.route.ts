import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createProjectSchema } from "../validations/project.validation.js";
import {
  requireWorkspaceAdmin,
  requireWorkspaceMember,
} from "../middlewares/Workspace.middleware.js";

export const projectRouter: Router = Router();
const projectController = new ProjectController();

projectRouter
  .route("/:workspaceId/projects")
  .post(
    restrictUserMiddleware(),
    validateBody(createProjectSchema),
    requireWorkspaceMember(),
    requireWorkspaceAdmin(),
    projectController.handlePostCreateProject.bind(projectController),
  )
  .get(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    projectController.handleGetProjects.bind(projectController),
  );
