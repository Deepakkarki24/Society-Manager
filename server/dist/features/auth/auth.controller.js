"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const audit_service_1 = require("../../services/audit.service");
const token_1 = require("../../utils/token");
const register = async (req, res) => {
    const { name, email, password, phone, societyId, flatNumber, block } = req.body;
    const existing = await models_1.User.findOne({ email });
    if (existing)
        throw new ApiError_1.ApiError(409, "Email already registered");
    const user = await models_1.User.create({
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
    res.status(201).json({
        success: true,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                society: user.society,
                flatNumber: user.flatNumber,
                block: user.block,
            },
            token,
        },
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await models_1.User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    if (!user.isActive)
        throw new ApiError_1.ApiError(403, "Account is deactivated");
    const token = (0, token_1.signToken)(user._id.toString(), user.role, user.society?.toString());
    await (0, audit_service_1.createAuditLog)(req, "login", "User", user._id.toString());
    res.json({
        success: true,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                society: user.society,
                flatNumber: user.flatNumber,
                block: user.block,
                avatar: user.avatar,
            },
            token,
        },
    });
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await models_1.User.findById(req.user?._id)
            .select("-password")
            .populate("society", "name city address");
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        res.json({ success: true, data: user });
    }
    catch (err) {
        console.log(err);
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    const { name, phone, avatar } = req.body;
    const user = await models_1.User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true, runValidators: true }).select("-password");
    res.json({ success: true, data: user });
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await models_1.User.findById(req.user._id).select("+password");
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    if (!(await user.comparePassword(currentPassword))) {
        throw new ApiError_1.ApiError(400, "Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map