import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { restrictUserMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validation.js";

export const userRouter: Router = Router();

const userController = new UserController();

userRouter.post(
  "/register",
  validateBody(registerUserSchema),
  userController.handleRegister.bind(userController),
);
userRouter.post(
  "/login",
  validateBody(loginUserSchema),
  userController.handleLogin.bind(userController),
);
userRouter.get(
  "/me",
  restrictUserMiddleware(),
  userController.handleMe.bind(userController),
);
