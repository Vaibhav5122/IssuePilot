import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError.js";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let finalizedError: ApiError;
  if (err instanceof ZodError) {
    finalizedError = ApiError.fromZod(err);
  } else if (err instanceof ApiError) {
    finalizedError = err;
  } else if (
    err?.type === "entity.parse.failed" ||
    err instanceof SyntaxError
  ) {
    // 🧠 Intercepts invalid, corrupt, or empty client JSON strings elegantly
    finalizedError = ApiError.badRequest(
      "Invalid or empty JSON payload provided",
    );
  } else if (err?.code === 11000) {
    finalizedError = ApiError.emailExists("Email already exists");
  } else {
    console.log(err);

    finalizedError = ApiError.serverError("Internal server Error");
  }

  res.status(finalizedError.statusCode).json({
    success: false,
    message: finalizedError.message,
  });
};
