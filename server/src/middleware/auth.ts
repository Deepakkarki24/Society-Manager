import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { ApiError } from "../utils/ApiError";
import { JwtPayload, UserRole } from "../types";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: UserRole;
    society?: string;
    name: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, "JWT configuration error");

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      society: user.society?.toString(),
      name: user.name,
      email: user.email,
    };
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export const authorize =
  (...roles: UserRole[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new ApiError(401, "Authentication required");
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Insufficient permissions");
    }
    next();
  };

export const requireSociety = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role === "super_admin") return next();
  if (!req.user?.society) {
    throw new ApiError(403, "Society context required");
  }
  next();
};
