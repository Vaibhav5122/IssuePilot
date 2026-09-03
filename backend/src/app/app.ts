import cors from "cors";
import express, { type Application } from "express";
import { connectDB } from "./configs/db.config.js";
import { globalErrorHandler } from "../common/utils/GlobalErrorHandler.js";
import { ApiError } from "../common/utils/ApiError.js";
import { userRouter } from "./routes/user.route.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
import { workspaceRouter } from "./routes/workspace.route.js";
import { projectRouter } from "./routes/project.route.js";
import { issueRouter } from "./routes/issue.route.js";
import { commentRouter } from "./routes/comment.route.js";

export async function expressApplication(): Promise<Application> {
  const expressApp = express();

  await connectDB();

  const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

  expressApp.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  expressApp.use(express.json());
  expressApp.use(authenticationMiddleware());
  expressApp.use("/api/v1/auth", userRouter);
  expressApp.use("/api/v1/workspaces", workspaceRouter);
  expressApp.use("/api/v1/projects/workspaces", projectRouter);
  expressApp.use("/api/v1/issues/workspaces", issueRouter);
  expressApp.use("/api/v1/comments/workspaces", commentRouter);

  expressApp.get("/", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "IssuePilot API is running",
      version: "1.0.0",
      health: "/health",
      apiBase: "/api/v1",
    });
  });

  expressApp.get("/health", (req, res) => {
    return res
      .status(200)
      .json({ success: true, message: "IssuePilot API is healthy" });
  });

  //Unknown APi endpoints

  expressApp.use((req, _res, next) => {
    next(new ApiError(404, "Route Not Found"));
  });

  //Global error handler

  expressApp.use(globalErrorHandler);

  return expressApp;
}
