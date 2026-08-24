import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import { Project } from "../models/project.model.js";

export function requireProjectId() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        return next(ApiError.badRequest("Project id not given"));
      }
      const isProject = await Project.findOne({
        _id: projectId,
        workspace: res.locals.workspace.id as string,
      });

      if (!isProject) {
        return next(ApiError.notFound("Project doesnt exists in workspace"));
      }
      res.locals.project = isProject;
      next();
    } catch (error) {
      return next(error);
    }
  };
}
