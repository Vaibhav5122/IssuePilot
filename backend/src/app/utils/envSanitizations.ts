import { z } from "zod";
import { ApiError } from "../../common/utils/ApiError.js";

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
});

function parsedEnvSchema(env: NodeJS.ProcessEnv) {
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw ApiError.fromZod(parsedEnv.error);
  }
  return parsedEnv.data;
}

export const envZod = parsedEnvSchema(process.env);
