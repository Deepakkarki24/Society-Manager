"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenanceStaff = exports.removeFamilyMember = exports.addFamilyMember = exports.deactivateUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const audit_service_1 = require("../../services/audit.service");
const getSocietyFilter = (req) => {
    if (req.user.role === "super_admin") {
        return req.query.societyId ? { society: req.query.societyId } : {};
    }
    return { society: req.user.society };
};
const createUser = async (req, res) => {
    const societyId = req.user.role === "super_admin" ? req.body.society : req.user.society;
    const user = await models_1.User.create({ ...req.body, society: societyId });
    await (0, audit_service_1.createAuditLog)(req, "create", "User", user._id.toString());
    const safeUser = await models_1.User.findById(user._id).select("-password");
    res.status(201).json({ success: true, data: safeUser });
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const filter = {
        ...getSocietyFilter(req),
        isActive: true,
    };
    if (req.query.role)
        filter.role = req.query.role;
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { flatNumber: { $regex: req.query.search, $options: "i" } },
        ];
    }
    const [users, total] = await Promise.all([
        models_1.User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.User.countDocuments(filter),
    ]);
    res.json({ success: true, ...(0, pagination_1.paginatedResponse)(users, total, page, limit) });
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    const user = await models_1.User.findById(req.params.id).select("-password");
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    res.json({ success: true, data: user });
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    const user = await models_1.User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    await (0, audit_service_1.createAuditLog)(req, "update", "User", user._id.toString());
    res.json({ success: true, data: user });
};
exports.updateUser = updateUser;
const deactivateUser = async (req, res) => {
    const user = await models_1.User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password");
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    await (0, audit_service_1.createAuditLog)(req, "deactivate", "User", user._id.toString());
    res.json({ success: true, message: "User deactivated" });
};
exports.deactivateUser = deactivateUser;
const addFamilyMember = async (req, res) => {
    const userId = req.user.role === "resident" ? req.user._id : req.params.id;
    const user = await models_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    user.familyMembers.push(req.body);
    await user.save();
    res.json({ success: true, data: user.familyMembers });
};
exports.addFamilyMember = addFamilyMember;
const removeFamilyMember = async (req, res) => {
    const userId = req.user.role === "resident" ? req.user._id : req.params.id;
    const user = await models_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    user.familyMembers = user.familyMembers.filter((m) => String(m._id) !==
        req.params.memberId);
    await user.save();
    res.json({ success: true, data: user.familyMembers });
};
exports.removeFamilyMember = removeFamilyMember;
const getMaintenanceStaff = async (req, res) => {
    const societyId = req.user.society || req.query.societyId;
    const staff = await models_1.User.find({
        society: societyId,
        role: "maintenance_staff",
        isActive: true,
    }).select("-password");
    res.json({ success: true, data: staff });
};
exports.getMaintenanceStaff = getMaintenanceStaff;
//# sourceMappingURL=user.controller.js.map