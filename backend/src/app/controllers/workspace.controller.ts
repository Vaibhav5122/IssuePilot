import type { Request, Response } from "express";
import type { WorkSpaceSchema } from "../validations/workspace.validation.js";
import type { TypeJWTPayload } from "../utils/jwtToken.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";
import { WorkspaceMember } from "../models/workspace-member.mode.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";

export class WorkspaceController {
  public async handleCreateWorkspace(
    req: Request<{}, {}, WorkSpaceSchema>,
    res: Response,
  ) {
    const { name, description } = req.body;

    if (!req.user || !req.user.id) {
      return ApiError.unauthorized("Unauthorized");
    }

    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newWorkspace = new Workspace({
        name,
        description,
        createdBy: userId,
      });
      await newWorkspace.save({ session });

      const newMember = new WorkspaceMember({
        workspace: newWorkspace.id,
        user: userId,
        role: "ADMIN",
      });
      await newMember.save({ session });

      await session.commitTransaction();
      session.endSession();

      return ApiResponse.created(res, "Workspace created successfully", {
        data: {
          workspace: { id: newWorkspace.id, name: newWorkspace.name },
          role: newMember.role,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw ApiError.serverError("Internal server error");
    }
  }
}
