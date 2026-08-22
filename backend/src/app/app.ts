import express, { type Application } from "express";
import { connectDB } from "./configs/db.config.js";
import { globalErrorHandler } from "../common/utils/GlobalErrorHandler.js";
import { ApiError } from "../common/utils/ApiError.js";
import { userRouter } from "./routes/user.route.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
import { workspaceRouter } from "./routes/workspace.route.js";

export async function expressApplication(): Promise<Application> {
  const expressApp = express();

  await connectDB();

  expressApp.use(express.json());
  expressApp.use(authenticationMiddleware());
  expressApp.use("/api/v1/auth", userRouter);
  expressApp.use("/api/v1/workspaces", workspaceRouter);

  expressApp.get("/health", (req, res) => {
    return res
      .status(200)
      .json({ success: true, message: "IssuePilot API is running" });
  });

  //Unknown APi endpoints

  expressApp.use((req, _res, next) => {
    next(new ApiError(404, "Route Not Found"));
  });

  //Global error handler

  expressApp.use(globalErrorHandler);

  return expressApp;
}
