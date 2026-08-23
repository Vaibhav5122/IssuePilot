import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import { WorkspaceMember } from "../models/workspace-member.model.js";
import { Workspace } from "../models/workspace.model.js";

export function requireWorkspaceMember() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;

      if (!workspaceId) {
        return next(ApiError.notFound("Workspace id not found"));
      }

      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return next(ApiError.notFound("Workspace not found"));
      }

      const membership = await WorkspaceMember.findOne({
        workspace: workspace.id,
        user: req.user!.id,
      });
      // console.log(membership);

      if (!membership) {
        return next(ApiError.notFound("You are not member of this workspace"));
      }

      res.locals.workspace = workspace;
      res.locals.membership = membership;

      next();
    } catch (error: any) {
      return next(ApiError.forbidden("Issue in workspace"));
    }
  };
}

export function requireWorkspaceAdmin() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (res.locals.membership.role !== "ADMIN") {
        return next(ApiError.forbidden("Admin access is required"));
      }
      next();
    } catch (error) {
      return next(
        ApiError.unauthorized(
          "Admin have only permissions for any modifiications",
        ),
      );
    }
  };
}

export function requireMemberId() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      const { workspaceId } = req.params;

      if (!memberId || !workspaceId) {
        return next(ApiError.notFound("Workspace or member id not found"));
      }

      const membershipId = await WorkspaceMember.findOne({
        user: memberId,
        workspace: res.locals.workspace.id,
      });

      if (!membershipId) {
        return next(ApiError.notFound("You are not member of this workspace"));
      }

      res.locals.memberId = membershipId;
      console.log("mmm", res.locals.memberId);

      next();
    } catch (error: any) {
      return next(ApiError.unauthorized("Issue in workspace"));
    }
  };
}
