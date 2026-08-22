// Adjust this path to your file
import { TypeJWTPayload } from "../app/utils/jwtToken.ts";

declare global {
  namespace Express {
    interface Request {
      user?: TypeJWTPayload;
    }
  }
}
