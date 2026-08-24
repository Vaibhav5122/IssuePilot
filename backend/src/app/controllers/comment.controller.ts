import type { Request, Response } from "express";
import type { CommentSchema } from "../validations/comment.validation.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";

export class CommentController {
  public async handlePostComments(
    req: Request<{}, {}, CommentSchema>,
    res: Response,
  ) {
    const { content } = req.body;
    const issue = res.locals.issue;

    const comment = await Comment.create({
      issue: issue.id,
      author: req.user?.id!,
      content,
    });

    if (!comment) {
      throw ApiError.badRequest("Comment not posted Try again...");
    }

    return ApiResponse.created(res, "Comment posted", comment);
  }
}
