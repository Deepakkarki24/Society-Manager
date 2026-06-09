import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types";
import { JWT_SECRET } from "../config/env";
import { errorResponse } from "../utils/ApiResponse";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: UserRole;
    society?: string;
    name: string;
    email: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const token = req.cookies.token
  const secret = JWT_SECRET;

  if (!secret) return errorResponse(res, 500, "JWT configuration error");

  if (!token) return errorResponse(res, 401, 'Null or Invalid token');

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return errorResponse(res, 401, "User not found or inactive");
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
    return errorResponse(res, 401, "Invalid or expired token");
  }
};

export const authorize = (...roles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => {

  if (!req.user) return errorResponse(res, 401, "Authentication required");

  if (!roles.includes(req.user.role)) {
    return errorResponse(res, 403, "Insufficient permissions");
  }
  next();
};

export const requireSociety = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === "super_admin") return next();

  if (!req.user?.society) {
    return errorResponse(res, 403, "Society context required");
  }
  next();
};
