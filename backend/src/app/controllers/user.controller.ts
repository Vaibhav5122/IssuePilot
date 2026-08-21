import type { Request, Response } from "express";
import {
  loginUserSchema,
  registerUserSchema,
  type LoginUserSchema,
  type RegisterUserSchemaType,
} from "../validations/user.validation.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/jwtToken.js";

export class UserController {
  public async handleRegister(
    req: Request<{}, {}, RegisterUserSchemaType>,
    res: Response,
  ) {
    const bodyCheck = await registerUserSchema.safeParseAsync(req.body);

    if (!bodyCheck.success) {
      throw ApiError.fromZod(bodyCheck.error);
    }

    const { name, email, password } = bodyCheck.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.badRequest("An account with this email already exists");
    }

    const newUser = await User.create({ name, email, password });

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    return ApiResponse.created(
      res,
      "User registered successfully",
      userResponse,
    );
  }
  public async handleLogin(
    req: Request<{}, {}, LoginUserSchema>,
    res: Response,
  ) {
    const bodyCheck = await loginUserSchema.safeParseAsync(req.body);
    if (!bodyCheck.success) {
      throw ApiError.fromZod(bodyCheck.error);
    }
    const { email, password } = bodyCheck.data;

    const existingUser = await User.findOne({ email });
    if (!existingUser || !existingUser.password) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = generateJwtToken({ id: existingUser.id });

    return ApiResponse.ok(res, "SignIn Success", { token });
  }
}
