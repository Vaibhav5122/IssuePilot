import type { Request, Response } from "express";
import type {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "../validations/project.validation.js";
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
  public async handleGetProjectById(req: Request, res: Response) {
    const project = res.locals.project;

    return ApiResponse.ok(res, "Project fetched successfully", project);
  }
  public async handlePatchProjectById(
    req: Request<{}, {}, UpdateProjectSchema>,
    res: Response,
  ) {
    const project = res.locals.project;

    const { name, description, status } = req.body;

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: project.id },
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedProject) {
      throw ApiError.badRequest("Project not updated");
    }
    return ApiResponse.ok(
      res,
      "Project changes updated successfully",
      updatedProject,
    );
  }
  public async handleDeleteProjectById(req: Request, res: Response) {
    const project = res.locals.project;

    const deletedProject = await Project.findByIdAndDelete(project.id);

    if (!deletedProject) {
      throw ApiError.badRequest("Project not deleted");
    }
    return ApiResponse.ok(res, "Project deleted successfully", deletedProject);
  }
}
