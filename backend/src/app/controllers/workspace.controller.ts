import type { Request, Response } from "express";
import type {
  AddWorkspaceMember,
  AddWorkspaceMemberRole,
  WorkspaceMembersSchema,
  WorkSpaceSchema,
} from "../validations/workspace.validation.js";
import type { TypeJWTPayload } from "../utils/jwtToken.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";
import {
  WorkspaceMember,
  type IWorkspaceMember,
} from "../models/workspace-member.model.js";
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
    const isExistingUser = await WorkspaceMember.findOne({
      workspace: membership.workspace,
      user: isUser.id,
    });

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

  public async handlePatchChangeMemberRole(
    req: Request<{}, {}, AddWorkspaceMemberRole>,
    res: Response,
  ) {
    const { role } = req.body;

    const memberId = res.locals.memberId;
    const membership = res.locals.membership;

    console.log(membership);

    if (memberId.user.toString() === req.user?.id) {
      throw ApiError.forbidden(
        "You cannot modify your own administrative role",
      );
    }

    const updatedMembership = await WorkspaceMember.findOneAndUpdate(
      { workspace: membership.workspace, user: memberId.user },
      { $set: { role } },
      { returnDocument: "after", runValidators: true },
    );
    console.log("update meme", updatedMembership);
    if (!updatedMembership) {
      throw ApiError.badRequest("User not belong to workspace");
    }
    return ApiResponse.ok(res, "Member role updated", updatedMembership);
  }
  public async handleDeleteMember(req: Request, res: Response) {
    const membership = res.locals.membership;
    const userId = res.locals.memberId;

    if (userId.user.toString() === req.user?.id) {
      throw ApiError.forbidden(
        "You cannot modify your own administrative role",
      );
    }

    const adminCount = await WorkspaceMember.countDocuments({
      workspace: membership.workspace,
      role: "ADMIN",
    });

    if (userId.role === "ADMIN" && adminCount <= 1) {
      throw ApiError.badRequest("A workspace must have at least one admin");
    }

    const deletedMember = await WorkspaceMember.findOneAndDelete({
      workspace: membership.workspace,
      user: userId.user,
    });
    if (!deletedMember) {
      throw ApiError.notFound(
        "The target user is not a member of this workspace",
      );
    }
    return ApiResponse.ok(res, "Member removed from workspace successfully", {
      workspaceId: deletedMember.workspace,
      removedUserId: deletedMember.user,
    });
  }
}
