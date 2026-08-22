import type { Request, Response } from "express";
import type {
  AddWorkspaceMember,
  WorkspaceMembersSchema,
  WorkSpaceSchema,
} from "../validations/workspace.validation.js";
import type { TypeJWTPayload } from "../utils/jwtToken.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";
import {
  WorkspaceMember,
  type IWorkspaceMember,
} from "../models/workspace-member.mode.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { User } from "../models/user.model.js";

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
  public async handleGetMyAllWorkspace(
    req: Request<{}, {}, WorkspaceMembersSchema>,
    res: Response,
  ) {
    const userId = req.user!.id;

    const workspaces = await WorkspaceMember.find({ user: userId }).populate(
      "workspace",
      "name description",
    );
    if (!workspaces) {
      throw ApiError.badRequest("No Workspaces found");
    }
    const formattedResponse = workspaces.map((item: any) => {
      return {
        workspace: {
          id: item.workspace._id,
          name: item.workspace.name,
        },
        role: item.role,
      };
    });
    return ApiResponse.ok(res, "Here is Your workspace", { formattedResponse });
  }
  public async handleGetOneWorkspace(req: Request, res: Response) {
    const membership = res.locals.membership;

    const response = await WorkspaceMember.findById(membership._id)
      .populate("workspace", "name description")
      .select("role");

    return ApiResponse.ok(res, "Successfully found workspace", response);
  }
  public async handleGetListMembers(req: Request, res: Response) {
    const membership = res.locals.membership;

    const response = await WorkspaceMember.find({
      workspace: membership.workspace,
    }).populate("user", "name email");

    return ApiResponse.ok(res, "User list of members", response);
  }
  //Add member in workspace

  public async handlePostAddMember(
    req: Request<{}, {}, AddWorkspaceMember>,
    res: Response,
  ) {
    const { email } = req.body;

    const membership = res.locals.membership;

    const isUser = await User.findOne({ email });

    if (!isUser) {
      throw ApiError.notFound("User not found to add in workspace");
    }
    const isExistingUser = await WorkspaceMember.findOne({ user: isUser.id });

    console.log(isExistingUser);

    if (isExistingUser) {
      throw ApiError.emailExists("User already present in workspace");
    }

    console.log(membership._id, isUser.id);

    const registerUser = await WorkspaceMember.create({
      workspace: membership.workspace,
      user: isUser.id,
      role: "MEMBER",
    });

    return ApiResponse.created(res, "User added in workspace", registerUser);
  }

  public async handlePatchChangeMemberRole(req: Request, res: Response) {}
}
