import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError.js";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let finalizedError: ApiError;

  if (err instanceof ZodError) {
    finalizedError = ApiError.fromZod(err);
  } else if (err instanceof ApiError) {
    finalizedError = err;
  } else {
    finalizedError = ApiError.serverError("Internal server Error");
  }

  res.status(finalizedError.statusCode).json({
    success: false,
    message: finalizedError.message,
  });
};
