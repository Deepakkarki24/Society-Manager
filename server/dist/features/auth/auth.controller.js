"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const ApiResponse_1 = require("../../utils/ApiResponse");
const audit_service_1 = require("../../services/audit.service");
const token_1 = require("../../utils/token");
const env_1 = require("../../config/env");
const User_1 = require("../../models/User");
const register = async (req, res) => {
    try {
        const { name, email, password, phone, societyId, flatNumber, block } = req.body;
        const existing = await User_1.User.findOne({ email });
        if (existing)
            return (0, ApiResponse_1.errorResponse)(res, 409, "Email already registered");
        const user = await User_1.User.create({
            name,
            email,
            password,
            phone,
            role: "resident",
            society: societyId,
            flatNumber,
            block,
        });
        const token = (0, token_1.signToken)(user._id.toString(), user.role, user.society?.toString());
        await (0, audit_service_1.createAuditLog)(req, "register", "User", user._id.toString());
        res.cookie("token", token, {
            httpOnly: true,
            secure: env_1.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const data = {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                society: user.society,
                flatNumber: user.flatNumber,
                block: user.block,
            }
        };
        return (0, ApiResponse_1.successResponse)(res, 200, "Registered successfully!", data);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return (0, ApiResponse_1.errorResponse)(res, 401, "Invalid email or password");
    }
    if (!user.isActive)
        return (0, ApiResponse_1.errorResponse)(res, 403, "Account is deactivated");
    const token = (0, token_1.signToken)(user._id.toString(), user.role, user.society?.toString());
    await (0, audit_service_1.createAuditLog)(req, "login", "User", user._id.toString());
    res.cookie("token", token, {
        httpOnly: true,
        secure: env_1.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const data = {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            society: user.society,
            flatNumber: user.flatNumber,
            block: user.block,
            avatar: user.avatar,
        }
    };
    return (0, ApiResponse_1.successResponse)(res, 200, "Loggedin successfully!", data);
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?._id)
            .select("-password")
            .populate("society", "name city address");
        if (!user)
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        return (0, ApiResponse_1.successResponse)(res, 200, "Fetched user data!", { data: user });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true, runValidators: true }).select("-password");
        return (0, ApiResponse_1.successResponse)(res, 200, "Profile updated!", { data: user });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.User.findById(req.user._id).select("+password");
        if (!user)
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        if (!(await user.comparePassword(currentPassword))) {
            return (0, ApiResponse_1.errorResponse)(res, 400, "Current password is incorrect");
        }
        user.password = newPassword;
        await user.save();
        return (0, ApiResponse_1.successResponse)(res, 200, "Password updated successfully");
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map