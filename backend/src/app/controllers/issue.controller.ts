import type { Request, Response } from "express";
import type {
  IssueSchema,
  PatchissueSchema,
} from "../validations/issue.validation.js";
import { Issue } from "../models/issue.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";
import mongoose from "mongoose";
import { IssueActivity } from "../models/issueActivity.model.js";

export class IssueController {
  public async handlePostcreateIssue(
    req: Request<{}, {}, IssueSchema>,
    res: Response,
  ) {
    const project = res.locals.project;
    const userId = req.user?.id;
    const { title, description, priority } = req.body;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const issue = await Issue.create({
      title,
      ...(description !== undefined && { description }),
      priority,
      project: project.id,
      createdBy: userId,
    });
    if (!issue) {
      throw ApiError.badRequest("Issue not created");
    }

    await IssueActivity.create({
      issue: issue.id,
      actor: userId,
      type: "ISSUE_CREATED",
      // ...(description !== undefined && { details: description }),
      details: {
        from: userId,
      },
    });

    return ApiResponse.created(res, "Issue created successfully", issue);
  }

  //Get All Issues
  //Filtered handleGetIssue used currently

  // public async handleGetAllIssues(req: Request, res: Response) {
  //   const project = res.locals.project;

  //   const issue = await Issue.find({
  //     project: project.id,
  //   });
  //   if (!issue) {
  //     throw ApiResponse.noContent(res);
  //   }
  //   return ApiResponse.ok(res, "Issue find successfully", issue);
  // }
  // Get Issue by Id

  public async handleGetIssueById(req: Request, res: Response) {
    return ApiResponse.ok(res, "Issue found successfully", res.locals.issue);
  }

  // Patch issue with Id

  public async handlePatchIssueById(
    req: Request<{}, {}, PatchissueSchema>,
    res: Response,
  ) {
    const issue = res.locals.issue;
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const { title, description, priority, status, assignee } = req.body;

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (assignee !== undefined) updateData.assignee = assignee;

    const patchedIssueDb = await Issue.findByIdAndUpdate(
      issue.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );
    if (!patchedIssueDb) {
      throw ApiError.badRequest("Issue not updated");
    }

    // store in mongodbArray

    const issueActivities = [];

    if (status && status !== issue.status) {
      issueActivities.push({
        issue: issue.id,
        actor: userId,
        type: "STATUS_CHANGED",
        details: {
          from: issue.status,
          to: status,
        },
      });
    }
    if (priority && priority !== issue.priority) {
      issueActivities.push({
        issue: issue.id,
        actor: userId,
        type: "PRIORITY_CHANGED",
        details: {
          from: issue.priority,
          to: priority,
        },
      });
    }
    const prevAssignee = issue.assignee?.toString() ?? null;
    const newAssignee = assignee?.toString() ?? null;
    if (assignee !== undefined && prevAssignee !== newAssignee) {
      issueActivities.push({
        issue: issue.id,
        actor: userId,
        type: "ASSIGNEE_CHANGED",
        details: {
          from: prevAssignee,
          to: newAssignee,
        },
      });
    }
    if (issueActivities.length > 0) {
      await IssueActivity.insertMany(issueActivities);
    }
    return ApiResponse.ok(
      res,
      "Issue changes updated successfully",
      patchedIssueDb,
    );
  }
  public async handleDeleteIssueById(req: Request, res: Response) {
    const issue = res.locals.issue;

    const deletedIssue = await Issue.findByIdAndDelete(issue.id);

    if (!deletedIssue) {
      throw ApiError.badRequest("Issue not deleted");
    }

    return ApiResponse.ok(res, "Issue deleted successfully", deletedIssue);
  }

  //Issue Filter

  public async handleGetIssueFilter(req: Request, res: Response) {
    const projectId = res.locals.project.id;
    const { status, priority, assignee } = req.query;

    const filter: Record<string, any> = {
      project: projectId,
    };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) {
      if (!mongoose.isValidObjectId(assignee)) {
        throw ApiError.badRequest("Invalid assignee ID");
      }
      filter.assignee = assignee;
    }

    const filteredResult = await Issue.find(filter).sort({ createdAt: -1 });

    if (!filteredResult) {
      throw ApiError.badRequest("Filter not applied");
    }

    return ApiResponse.ok(res, "Issue filtered", filteredResult);
  }

  //Get issueActivity

  public async handleGetIssueActivity(req: Request, res: Response) {
    const { issueId } = req.params;

    if (!issueId || !mongoose.isValidObjectId(issueId)) {
      throw ApiError.badRequest("Invalid issueId");
    }

    const activities = await IssueActivity.find({ issue: issueId })
      .populate("actor", "name email")
      .sort({ createdAt: -1 });

    return ApiResponse.ok(res, "Activity fetched", activities);
  }
}
