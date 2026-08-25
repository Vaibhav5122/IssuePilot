import type { Request, Response } from "express";
import type { CommentSchema } from "../validations/comment.validation.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";
import mongoose from "mongoose";
import { IssueActivity } from "../models/issueActivity.model.js";

export class CommentController {
  public async handlePostComments(
    req: Request<{}, {}, CommentSchema>,
    res: Response,
  ) {
    const { content } = req.body;
    const issue = res.locals.issue;

    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const comment = await Comment.create({
      issue: issue.id,
      author: userId,
      content,
    });

    if (!comment) {
      throw ApiError.badRequest("Comment not posted Try again...");
    }
    await IssueActivity.create({
      issue: issue.id,
      actor: userId,
      type: "COMMENT_ADDED",
      details: {
        from: issue.id,
      },
    });

    return ApiResponse.created(res, "Comment posted", comment);
  }
  //Get comments

  public async handleGetComment(req: Request, res: Response) {
    const issue = res.locals.issue;

    const comments = await Comment.find({ issue: issue.id });

    if (!comments) {
      ApiResponse.noContent(res);
    }

    return ApiResponse.ok(res, "Comments fetched succesfully", comments);
  }

  //Delete comment by Author or Admin

  public async handleDeleteCommentById(req: Request, res: Response) {
    const userId = req.user?.id;
    const admin = res.locals.membership;
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
      throw ApiError.badRequest("Invalid comment id");
    }

    const commentCheck = await Comment.findById(commentId);

    if (!commentCheck) {
      throw ApiError.notFound("Comment not found");
    }
    const isAuthor = commentCheck?.author.toString() === userId?.toString();
    const isAdmin = admin.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      throw ApiError.forbidden("Do Not have permission to delete comment");
    }

    const comment = await Comment.findOne({
      id: commentId,
      issue: res.locals.issue.id,
    });

    if (!comment) {
      throw ApiError.notFound("Comment not found in this issue");
    }

    const deleteComment = await Comment.findOneAndDelete({
      id: comment.id,
      issue: res.locals.issue.id,
    });

    return ApiResponse.ok(res, "Comment deleted successfully", deleteComment);
  }
}
