"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncement = exports.getAnnouncements = exports.createAnnouncement = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const asyncHandler_1 = require("../../utils/asyncHandler");
const pagination_1 = require("../../utils/pagination");
const notification_service_1 = require("../../services/notification.service");
exports.createAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const societyId = req.user.society;
    if (!societyId)
        throw new ApiError_1.ApiError(400, 'Society context required');
    const announcement = await models_1.Announcement.create({
        ...req.body,
        society: societyId,
        createdBy: req.user._id,
    });
    const residents = await models_1.User.find({
        society: societyId,
        role: 'resident',
        isActive: true,
    });
    await Promise.all(residents.map((r) => (0, notification_service_1.createNotification)({
        recipientId: r._id.toString(),
        title: req.body.isImportant ? 'Important Notice' : 'New Announcement',
        message: announcement.title,
        type: 'announcement',
        link: `/announcements/${announcement._id}`,
    })));
    res.status(201).json({ success: true, data: announcement });
});
exports.getAnnouncements = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const societyId = req.user.role === 'super_admin'
        ? req.query.societyId
        : req.user.society;
    const filter = {};
    if (societyId)
        filter.society = societyId;
    if (req.query.important === 'true')
        filter.isImportant = true;
    if (req.query.events === 'true')
        filter.isEvent = true;
    const [announcements, total] = await Promise.all([
        models_1.Announcement.find(filter)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.Announcement.countDocuments(filter),
    ]);
    res.json({ success: true, ...(0, pagination_1.paginatedResponse)(announcements, total, page, limit) });
});
exports.getAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const announcement = await models_1.Announcement.findById(req.params.id).populate('createdBy', 'name role');
    if (!announcement)
        throw new ApiError_1.ApiError(404, 'Announcement not found');
    res.json({ success: true, data: announcement });
});
exports.updateAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const announcement = await models_1.Announcement.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!announcement)
        throw new ApiError_1.ApiError(404, 'Announcement not found');
    res.json({ success: true, data: announcement });
});
exports.deleteAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const announcement = await models_1.Announcement.findByIdAndDelete(req.params.id);
    if (!announcement)
        throw new ApiError_1.ApiError(404, 'Announcement not found');
    res.json({ success: true, message: 'Announcement deleted' });
});
//# sourceMappingURL=announcement.controller.js.map