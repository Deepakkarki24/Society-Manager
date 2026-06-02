"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocietyStats = exports.assignSocietyAdmin = exports.deleteSociety = exports.updateSociety = exports.getSociety = exports.getSocieties = exports.createSociety = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const asyncHandler_1 = require("../../utils/asyncHandler");
const pagination_1 = require("../../utils/pagination");
const audit_service_1 = require("../../services/audit.service");
exports.createSociety = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const society = await models_1.Society.create(req.body);
    await (0, audit_service_1.createAuditLog)(req, 'create', 'Society', society._id.toString());
    res.status(201).json({ success: true, data: society });
});
exports.getSocieties = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const search = req.query.search || '';
    const filter = {};
    if (search) {
        filter.$text = { $search: search };
    }
    if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === 'true';
    }
    const [societies, total] = await Promise.all([
        models_1.Society.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        models_1.Society.countDocuments(filter),
    ]);
    res.json({
        success: true,
        ...(0, pagination_1.paginatedResponse)(societies, total, page, limit),
    });
});
exports.getSociety = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const society = await models_1.Society.findById(req.params.id);
    if (!society)
        throw new ApiError_1.ApiError(404, 'Society not found');
    res.json({ success: true, data: society });
});
exports.updateSociety = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const society = await models_1.Society.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!society)
        throw new ApiError_1.ApiError(404, 'Society not found');
    await (0, audit_service_1.createAuditLog)(req, 'update', 'Society', society._id.toString());
    res.json({ success: true, data: society });
});
exports.deleteSociety = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const society = await models_1.Society.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!society)
        throw new ApiError_1.ApiError(404, 'Society not found');
    await (0, audit_service_1.createAuditLog)(req, 'deactivate', 'Society', society._id.toString());
    res.json({ success: true, message: 'Society deactivated' });
});
exports.assignSocietyAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.body;
    const societyId = req.params.id;
    const user = await models_1.User.findByIdAndUpdate(userId, { role: 'society_admin', society: societyId }, { new: true }).select('-password');
    if (!user)
        throw new ApiError_1.ApiError(404, 'User not found');
    await (0, audit_service_1.createAuditLog)(req, 'assign_admin', 'User', userId, { societyId });
    res.json({ success: true, data: user });
});
exports.getSocietyStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const societyId = req.params.id;
    const [residents, staff, admins] = await Promise.all([
        models_1.User.countDocuments({ society: societyId, role: 'resident', isActive: true }),
        models_1.User.countDocuments({ society: societyId, role: 'maintenance_staff', isActive: true }),
        models_1.User.countDocuments({ society: societyId, role: 'society_admin', isActive: true }),
    ]);
    res.json({
        success: true,
        data: { residents, maintenanceStaff: staff, admins },
    });
});
//# sourceMappingURL=society.controller.js.map