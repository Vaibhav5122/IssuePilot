import jwt from "jsonwebtoken";
import { ApiError } from "../../common/utils/ApiError.js";
import { envZod } from "./envSanitizations.js";

export interface TypeJWTPayload {
  id: string;
}

export function generateJwtToken(payload: TypeJWTPayload) {
  try {
    return jwt.sign(payload, envZod.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    throw ApiError.jwtNotFoundError("Access token not generated");
  }
}

export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, envZod.JWT_SECRET);
  } catch (error) {
    throw ApiError.unauthorized("Invalid Token");
  }
}
