import express, { type Application } from "express";

export function expressApplication(): Application {
  const expressApp = express();

  expressApp.get("/health", (req, res) => {
    return res
      .status(200)
      .json({ success: true, message: "IssuePilot API is running" });
  });

  return expressApp;
}
