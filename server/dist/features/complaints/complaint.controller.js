"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplaintHistory = exports.addComment = exports.reopenComplaint = exports.updateComplaintStatus = exports.assignComplaint = exports.getComplaint = exports.getComplaints = exports.createComplaint = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const asyncHandler_1 = require("../../utils/asyncHandler");
const pagination_1 = require("../../utils/pagination");
const upload_1 = require("../../middleware/upload");
const audit_service_1 = require("../../services/audit.service");
const notification_service_1 = require("../../services/notification.service");
const mongoose_1 = __importDefault(require("mongoose"));
const buildComplaintFilter = (req) => {
    const filter = {};
    if (req.user.role === 'super_admin' && req.query.societyId) {
        filter.society = req.query.societyId;
    }
    else if (req.user.role !== 'super_admin') {
        filter.society = req.user.society;
    }
    if (req.user.role === 'resident') {
        filter.createdBy = req.user._id;
    }
    else if (req.user.role === 'maintenance_staff') {
        filter.assignedTo = req.user._id;
    }
    if (req.query.status)
        filter.status = req.query.status;
    if (req.query.category)
        filter.category = req.query.category;
    if (req.query.priority)
        filter.priority = req.query.priority;
    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } },
        ];
    }
    return filter;
};
const addTimeline = (status, userId, note) => ({
    status,
    note,
    updatedBy: new mongoose_1.default.Types.ObjectId(userId),
    createdAt: new Date(),
});
exports.createComplaint = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const images = await (0, upload_1.uploadMultipleImages)(req.files, 'complaints');
    const societyId = req.user.society;
    if (!societyId)
        throw new ApiError_1.ApiError(400, 'Resident must belong to a society');
    const complaint = await models_1.Complaint.create({
        ...req.body,
        society: societyId,
        createdBy: req.user._id,
        images,
        timeline: [addTimeline('pending', req.user._id, 'Complaint created')],
    });
    const populated = await models_1.Complaint.findById(complaint._id)
        .populate('createdBy', 'name email flatNumber')
        .populate('society', 'name');
    const admins = await models_1.User.find({
        society: societyId,
        role: 'society_admin',
        isActive: true,
    });
    await Promise.all(admins.map((admin) => (0, notification_service_1.createNotification)({
        recipientId: admin._id.toString(),
        title: 'New Complaint',
        message: `New complaint: ${complaint.title}`,
        type: 'complaint',
        link: `/complaints/${complaint._id}`,
    })));
    await (0, audit_service_1.createAuditLog)(req, 'create', 'Complaint', complaint._id.toString());
    res.status(201).json({ success: true, data: populated });
});
exports.getComplaints = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const filter = buildComplaintFilter(req);
    const [complaints, total] = await Promise.all([
        models_1.Complaint.find(filter)
            .populate('createdBy', 'name email flatNumber block')
            .populate('assignedTo', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.Complaint.countDocuments(filter),
    ]);
    res.json({ success: true, ...(0, pagination_1.paginatedResponse)(complaints, total, page, limit) });
});
exports.getComplaint = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const complaint = await models_1.Complaint.findById(req.params.id)
        .populate('createdBy', 'name email flatNumber block phone')
        .populate('assignedTo', 'name email phone')
        .populate('comments.user', 'name role avatar')
        .populate('timeline.updatedBy', 'name role');
    if (!complaint)
        throw new ApiError_1.ApiError(404, 'Complaint not found');
    if (req.user.role === 'resident' &&
        complaint.createdBy._id.toString() !== req.user._id) {
        throw new ApiError_1.ApiError(403, 'Access denied');
    }
    res.json({ success: true, data: complaint });
});
exports.assignComplaint = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { assignedTo, note } = req.body;
    const complaint = await models_1.Complaint.findById(req.params.id);
    if (!complaint)
        throw new ApiError_1.ApiError(404, 'Complaint not found');
    complaint.assignedTo = assignedTo;
    complaint.status = 'assigned';
    complaint.timeline.push(addTimeline('assigned', req.user._id, note));
    await complaint.save();
    await (0, notification_service_1.createNotification)({
        recipientId: assignedTo,
        title: 'Complaint Assigned',
        message: `You have been assigned: ${complaint.title}`,
        type: 'complaint',
        link: `/complaints/${complaint._id}`,
    });
    await (0, audit_service_1.createAuditLog)(req, 'assign', 'Complaint', complaint._id.toString());
    res.json({ success: true, data: complaint });
});
exports.updateComplaintStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, note } = req.body;
    const complaint = await models_1.Complaint.findById(req.params.id);
    if (!complaint)
        throw new ApiError_1.ApiError(404, 'Complaint not found');
    if (req.user.role === 'maintenance_staff' &&
        complaint.assignedTo?.toString() !== req.user._id) {
        throw new ApiError_1.ApiError(403, 'Not assigned to this complaint');
    }
    complaint.status = status;
    complaint.timeline.push(addTimeline(status, req.user._id, note));
    if (status === 'resolved') {
        complaint.resolvedAt = new Date();
        const proof = await (0, upload_1.uploadMultipleImages)(req.files, 'complaint-proof');
        if (proof.length)
            complaint.completionProof.push(...proof);
    }
    await complaint.save();
    await (0, notification_service_1.createNotification)({
        recipientId: complaint.createdBy.toString(),
        title: 'Complaint Updated',
        message: `Your complaint "${complaint.title}" is now ${status}`,
        type: 'complaint',
        link: `/complaints/${complaint._id}`,
    });
    res.json({ success: true, data: complaint });
});
exports.reopenComplaint = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const complaint = await models_1.Complaint.findById(req.params.id);
    if (!complaint)
        throw new ApiError_1.ApiError(404, 'Complaint not found');
    if (complaint.createdBy.toString() !== req.user._id) {
        throw new ApiError_1.ApiError(403, 'Only the creator can reopen');
    }
    complaint.status = 'reopened';
    complaint.resolvedAt = undefined;
    complaint.timeline.push(addTimeline('reopened', req.user._id, req.body.note || 'Complaint reopened'));
    await complaint.save();
    res.json({ success: true, data: complaint });
});
exports.addComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const complaint = await models_1.Complaint.findById(req.params.id);
    if (!complaint)
        throw new ApiError_1.ApiError(404, 'Complaint not found');
    complaint.comments.push({
        user: req.user._id,
        text: req.body.text,
        createdAt: new Date(),
    });
    await complaint.save();
    const updated = await models_1.Complaint.findById(complaint._id).populate('comments.user', 'name role avatar');
    res.json({ success: true, data: updated });
});
exports.getComplaintHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filter = {
        createdBy: req.user._id,
        status: { $in: ['resolved', 'reopened'] },
    };
    if (req.user.society)
        filter.society = req.user.society;
    const complaints = await models_1.Complaint.find(filter)
        .sort({ updatedAt: -1 })
        .limit(50);
    res.json({ success: true, data: complaints });
});
//# sourceMappingURL=complaint.controller.js.map