import type { Request, Response, NextFunction } from "express";
import { verifyJwtToken, type TypeJWTPayload } from "../utils/jwtToken.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { User } from "../models/user.model.js";

export interface TypeAuthenticationUser extends Request {
  user?: TypeJWTPayload;
}

export function authenticationMiddleware() {
  return async function (
    req: TypeAuthenticationUser,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers["authorization"];
      if (!header) {
        return next();
      }
      if (!header.startsWith("Bearer ")) {
        throw ApiError.unauthorized(
          "Authorization header must starts with Bearer",
        );
      }
      const token = header.split(" ")[1];
      if (!token) {
        throw ApiError.unauthorized(
          "Authorization header must starts with Bearer and followed by token",
        );
      }
      const payload = verifyJwtToken(token) as TypeJWTPayload;

      const user = await User.findById(payload.id);

      if (!user) {
        throw ApiError.unauthorized("User no longer exists");
      }

      req.user = { id: user.id };
      next();
    } catch (error: any) {
      console.log(error);
      return next(
        ApiError.unauthorized(error.message || "Invalid token credentials"),
      );
    }
  };
}

export function restrictUserMiddleware() {
  return function (
    req: TypeAuthenticationUser,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user) {
        return next(
          ApiError.jwtNotFoundError(
            "Authentication required to access this resource",
          ),
        );
      }
      next();
    } catch (error: any) {
      console.log(error);
      return next(
        ApiError.unauthorized(
          "Authentication required to access this resource",
        ),
      );
    }
  };
}
