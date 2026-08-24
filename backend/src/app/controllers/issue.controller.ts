import type { Request, Response } from "express";
import type { IssueSchema } from "../validations/issue.validation.js";
import { Issue } from "../models/issue.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

export class IssueController {
  public async handlePostcreateIssue(
    req: Request<{}, {}, IssueSchema>,
    res: Response,
  ) {
    const project = res.locals.project;
    const { title, description, priority } = req.body;

    const issue = await Issue.create({
      title,
      ...(description !== undefined && { description }),
      priority,
      project: project.id,
      createdBy: req.user?.id!,
    });

    return ApiResponse.created(res, "Issue created successfully", issue);
  }

  //Get Issue by Id

  public async handleGetAllIssues(req: Request, res: Response) {
    const project = res.locals.project;

    const issue = await Issue.find({
      project: project.id,
    });
    if (!issue) {
      throw ApiResponse.noContent(res);
    }
    return ApiResponse.ok(res, "Issue find successfully", issue);
  }
}
