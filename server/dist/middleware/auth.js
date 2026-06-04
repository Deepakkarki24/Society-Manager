"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSociety = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const ApiError_1 = require("../utils/ApiError");
const authenticate = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError_1.ApiError(401, "Authentication required");
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new ApiError_1.ApiError(500, "JWT configuration error");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await models_1.User.findById(decoded.userId).select("-password");
        if (!user || !user.isActive) {
            throw new ApiError_1.ApiError(401, "User not found or inactive");
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
        throw new ApiError_1.ApiError(401, "Invalid or expired token");
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user)
        throw new ApiError_1.ApiError(401, "Authentication required");
    if (!roles.includes(req.user.role)) {
        throw new ApiError_1.ApiError(403, "Insufficient permissions");
    }
    next();
};
exports.authorize = authorize;
const requireSociety = (req, _res, next) => {
    if (req.user?.role === "super_admin")
        return next();
    if (!req.user?.society) {
        throw new ApiError_1.ApiError(403, "Society context required");
    }
    next();
};
exports.requireSociety = requireSociety;
//# sourceMappingURL=auth.js.map