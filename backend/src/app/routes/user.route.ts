import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

export const userRouter: Router = Router();

const userController = new UserController();

userRouter.post(
  "/register",
  userController.handleRegister.bind(userController),
);
userRouter.post("/login", userController.handleLogin.bind(userController));
