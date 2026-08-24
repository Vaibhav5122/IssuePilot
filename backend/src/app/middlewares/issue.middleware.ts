import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ApiError } from "../../common/utils/ApiError.js";
import { Issue } from "../models/issue.model.js";

export function requireIssueId() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { issueId } = req.params;
      const projectId = res.locals.project.id;

      if (
        !issueId ||
        !mongoose.isValidObjectId(issueId) ||
        !mongoose.isValidObjectId(projectId)
      ) {
        return next(ApiError.badRequest("Issue ID or Project ID is invalid"));
      }

      const issue = await Issue.findOne({
        _id: issueId,
        project: projectId,
      });

      if (!issue) {
        return next(ApiError.notFound("Issue doesn't exists in this project"));
      }
      res.locals.issue = issue;
      next();
    } catch (error) {
      return next(error);
    }
  };
}
