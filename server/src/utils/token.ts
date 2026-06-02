import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
import jwt, { SignOptions } from "jsonwebtoken";

export const signToken = (userId: string, role: string, societyId?: string) => {
  const secret = JWT_SECRET!;
  const expiresIn = JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId, role, societyId }, secret, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};
