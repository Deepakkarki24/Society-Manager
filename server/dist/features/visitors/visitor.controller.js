"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectVisitor = exports.checkOutVisitor = exports.checkInVisitor = exports.getVisitors = exports.preApproveVisitor = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const asyncHandler_1 = require("../../utils/asyncHandler");
const pagination_1 = require("../../utils/pagination");
const getSocietyId = (req) => req.user.role === 'super_admin'
    ? req.query.societyId
    : req.user.society;
exports.preApproveVisitor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const societyId = req.user.society;
    if (!societyId)
        throw new ApiError_1.ApiError(400, 'Society context required');
    const host = await models_1.User.findById(req.user._id);
    const flatNumber = req.body.flatNumber || host?.flatNumber || 'N/A';
    const visitor = await models_1.Visitor.create({
        ...req.body,
        society: societyId,
        hostResident: req.user._id,
        flatNumber,
        status: 'pre_approved',
    });
    res.status(201).json({ success: true, data: visitor });
});
exports.getVisitors = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const societyId = getSocietyId(req);
    const filter = {};
    if (societyId)
        filter.society = societyId;
    if (req.user.role === 'resident')
        filter.hostResident = req.user._id;
    if (req.query.status)
        filter.status = req.query.status;
    if (req.query.date) {
        const date = new Date(req.query.date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.createdAt = { $gte: date, $lt: nextDay };
    }
    const [visitors, total] = await Promise.all([
        models_1.Visitor.find(filter)
            .populate('hostResident', 'name flatNumber block')
            .populate('verifiedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.Visitor.countDocuments(filter),
    ]);
    res.json({ success: true, ...(0, pagination_1.paginatedResponse)(visitors, total, page, limit) });
});
exports.checkInVisitor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const visitor = await models_1.Visitor.findByIdAndUpdate(req.params.id, {
        status: 'checked_in',
        checkInAt: new Date(),
        verifiedBy: req.user._id,
        notes: req.body.notes,
    }, { new: true });
    if (!visitor)
        throw new ApiError_1.ApiError(404, 'Visitor not found');
    res.json({ success: true, data: visitor });
});
exports.checkOutVisitor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const visitor = await models_1.Visitor.findByIdAndUpdate(req.params.id, { status: 'checked_out', checkOutAt: new Date() }, { new: true });
    if (!visitor)
        throw new ApiError_1.ApiError(404, 'Visitor not found');
    res.json({ success: true, data: visitor });
});
exports.rejectVisitor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const visitor = await models_1.Visitor.findByIdAndUpdate(req.params.id, { status: 'rejected', notes: req.body.notes }, { new: true });
    if (!visitor)
        throw new ApiError_1.ApiError(404, 'Visitor not found');
    res.json({ success: true, data: visitor });
});
//# sourceMappingURL=visitor.controller.js.map