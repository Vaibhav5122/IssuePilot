import type { Request, Response } from "express";
import {
  type LoginUserSchema,
  type RegisterUserSchemaType,
} from "../validations/user.validation.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import { generateJwtToken, type TypeJWTPayload } from "../utils/jwtToken.js";
import type { TypeAuthenticationUser } from "../middlewares/auth.middleware.js";

export class UserController {
  public async handleRegister(
    req: Request<{}, {}, RegisterUserSchemaType>,
    res: Response,
  ) {
    //Body validated by middleware
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.emailExists("An account with this email already exists");
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
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).select("+password");
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

    const userResponse = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };

    return ApiResponse.ok(res, "SignIn Success", { userResponse, token });
  }

  public async handleMe(req: TypeAuthenticationUser, res: Response) {
    const { id } = req.user as TypeJWTPayload;

    const user = await User.findById(id);

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    return ApiResponse.ok(res, "User found", {
      name: user.name,
      email: user.email,
    });
  }
}
