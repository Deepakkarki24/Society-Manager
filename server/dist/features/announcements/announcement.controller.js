"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncement = exports.getAnnouncements = exports.createAnnouncement = void 0;
const pagination_1 = require("../../utils/pagination");
const notification_service_1 = require("../../services/notification.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const Announcement_1 = require("../../models/Announcement");
const User_1 = require("../../models/User");
const createAnnouncement = async (req, res) => {
    try {
        const societyId = req.user.society;
        if (!societyId) {
            return (0, ApiResponse_1.errorResponse)(res, 400, "Society context required");
        }
        const announcement = await Announcement_1.Announcement.create({
            ...req.body,
            society: societyId,
            createdBy: req.user._id,
        });
        const residents = await User_1.User.find({
            society: societyId,
            role: "resident",
            isActive: true,
        });
        await Promise.all(residents.map((r) => (0, notification_service_1.createNotification)({
            recipientId: r._id.toString(),
            title: req.body.isImportant
                ? "Important Notice"
                : "New Announcement",
            message: announcement.title,
            type: "announcement",
            link: `/announcements/${announcement._id}`,
        })));
        return (0, ApiResponse_1.successResponse)(res, 201, "Announcement created successfully", announcement);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.createAnnouncement = createAnnouncement;
const getAnnouncements = async (req, res) => {
    try {
        const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
        const societyId = req.user.role === "super_admin"
            ? req.query.societyId
            : req.user.society;
        const filter = {};
        if (societyId)
            filter.society = societyId;
        if (req.query.important === "true")
            filter.isImportant = true;
        if (req.query.events === "true")
            filter.isEvent = true;
        const [announcements, total] = await Promise.all([
            Announcement_1.Announcement.find(filter)
                .populate("createdBy", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Announcement_1.Announcement.countDocuments(filter),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Announcements fetched successfully", (0, pagination_1.paginatedResponse)(announcements, total, page, limit));
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getAnnouncements = getAnnouncements;
const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement_1.Announcement.findById(req.params.id).populate("createdBy", "name role");
        if (!announcement) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Announcement not found");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "Announcement fetched successfully", announcement);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getAnnouncement = getAnnouncement;
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement_1.Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!announcement) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Announcement not found");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "Announcement updated successfully", announcement);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement_1.Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Announcement not found");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "Announcement deleted successfully");
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
//# sourceMappingURL=announcement.controller.js.map