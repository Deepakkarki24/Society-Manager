"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSociety = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiResponse_1 = require("../utils/ApiResponse");
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    const secret = env_1.JWT_SECRET;
    if (!secret)
        return (0, ApiResponse_1.errorResponse)(res, 500, "JWT configuration error");
    if (!token)
        return (0, ApiResponse_1.errorResponse)(res, 401, 'Null or Invalid token');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await User_1.User.findById(decoded.userId).select("-password");
        if (!user || !user.isActive) {
            return (0, ApiResponse_1.errorResponse)(res, 401, "User not found or inactive");
        }
        req.user = {
            _id: user._id.toString(),
            role: user.role,
            society: user.society?.toString(),
            name: user.name,
            email: user.email,
        };
        next();
    }
    catch {
        return (0, ApiResponse_1.errorResponse)(res, 401, "Invalid or expired token");
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user)
        return (0, ApiResponse_1.errorResponse)(res, 401, "Authentication required");
    if (!roles.includes(req.user.role)) {
        return (0, ApiResponse_1.errorResponse)(res, 403, "Insufficient permissions");
    }
    next();
};
exports.authorize = authorize;
const requireSociety = (req, res, next) => {
    if (req.user?.role === "super_admin")
        return next();
    if (!req.user?.society) {
        return (0, ApiResponse_1.errorResponse)(res, 403, "Society context required");
    }
    next();
};
exports.requireSociety = requireSociety;
//# sourceMappingURL=auth.js.map