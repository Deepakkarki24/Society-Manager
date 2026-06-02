"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const asyncHandler_1 = require("../../utils/asyncHandler");
const audit_service_1 = require("../../services/audit.service");
const signToken = (userId, role, societyId) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ userId, role, societyId }, secret, {
        expiresIn: expiresIn,
    });
};
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password, phone, societyId, flatNumber, block } = req.body;
    const existing = await models_1.User.findOne({ email });
    if (existing)
        throw new ApiError_1.ApiError(409, 'Email already registered');
    const user = await models_1.User.create({
        name,
        email,
        password,
        phone,
        role: 'resident',
        society: societyId,
        flatNumber,
        block,
    });
    const token = signToken(user._id.toString(), user.role, user.society?.toString());
    await (0, audit_service_1.createAuditLog)(req, 'register', 'User', user._id.toString());
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
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await models_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password');
    }
    if (!user.isActive)
        throw new ApiError_1.ApiError(403, 'Account is deactivated');
    const token = signToken(user._id.toString(), user.role, user.society?.toString());
    await (0, audit_service_1.createAuditLog)(req, 'login', 'User', user._id.toString());
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
});
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await models_1.User.findById(req.user._id)
        .select('-password')
        .populate('society', 'name city address');
    if (!user)
        throw new ApiError_1.ApiError(404, 'User not found');
    res.json({ success: true, data: user });
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, phone, avatar } = req.body;
    const user = await models_1.User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, data: user });
});
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await models_1.User.findById(req.user._id).select('+password');
    if (!user)
        throw new ApiError_1.ApiError(404, 'User not found');
    if (!(await user.comparePassword(currentPassword))) {
        throw new ApiError_1.ApiError(400, 'Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
});
//# sourceMappingURL=auth.controller.js.map