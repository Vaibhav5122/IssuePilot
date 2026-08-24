import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validation.js";
import {
  requireWorkspaceAdmin,
  requireWorkspaceMember,
} from "../middlewares/workspace.middleware.js";
import { requireProjectId } from "../middlewares/project.middleware.js";

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

projectRouter
  .route("/:workspaceId/projects/:projectId")
  .get(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireProjectId(),
    projectController.handleGetProjectById.bind(projectController),
  )
  .patch(
    restrictUserMiddleware(),
    validateBody(updateProjectSchema),
    requireWorkspaceMember(),
    requireWorkspaceAdmin(),
    requireProjectId(),
    projectController.handlePatchProjectById.bind(projectController),
  )
  .delete(
    restrictUserMiddleware(),
    requireWorkspaceMember(),
    requireWorkspaceAdmin(),
    requireProjectId(),
    projectController.handleDeleteProjectById.bind(projectController),
  );
