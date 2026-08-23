import type { Request, Response } from "express";
import type { CreateProjectSchema } from "../validations/project.validation.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

export class ProjectController {
  public async handlePostCreateProject(
    req: Request<{}, {}, CreateProjectSchema>,
    res: Response,
  ) {
    const { name, description } = req.body;

    if (!req.user || !req.user.id) {
      throw ApiError.badRequest("User not found");
    }

    const workspaceId = res.locals.workspace.id;

    const createProject = await Project.create({
      name,
      ...(description !== undefined && { description }),
      workspace: workspaceId,
      createdBy: req.user?.id,
    });

    return ApiResponse.created(
      res,
      "Project created successfully",
      createProject,
    );
  }
  public async handleGetProjects(req: Request, res: Response) {
    const workspaceId = res.locals.workspace.id;

    const projects = await Project.find({ workspace: workspaceId });

    if (!projects || projects === undefined) {
      return ApiResponse.noContent(res);
    }
    return ApiResponse.ok(res, "Projects found!", projects);
  }
}
