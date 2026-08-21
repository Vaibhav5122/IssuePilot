import express, { type Application } from "express";
import { connectDB } from "./configs/db.config.js";
import { globalErrorHandler } from "../utils/GlobalErrorHandler.js";
import { ApiError } from "../utils/ApiError.js";

export async function expressApplication(): Promise<Application> {
  const expressApp = express();

  await connectDB();

  expressApp.use(express.json());

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
