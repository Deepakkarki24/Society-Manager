"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const pagination_1 = require("../../utils/pagination");
const ApiResponse_1 = require("../../utils/ApiResponse");
const Notification_1 = require("../../models/Notification");
const getNotifications = async (req, res) => {
    try {
        const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
        const filter = {
            recipient: req.user._id,
        };
        if (req.query.unread === "true") {
            filter.isRead = false;
        }
        const [notifications, total] = await Promise.all([
            Notification_1.Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Notification_1.Notification.countDocuments(filter),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Notifications fetched successfully", (0, pagination_1.paginatedResponse)(notifications, total, page, limit));
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to fetch notifications");
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification_1.Notification.findOneAndUpdate({
            _id: req.params.id,
            recipient: req.user._id,
        }, {
            isRead: true,
        }, {
            new: true,
        });
        if (!notification) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Notification not found");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "Notification marked as read", notification);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to update notification");
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await Notification_1.Notification.updateMany({
            recipient: req.user._id,
            isRead: false,
        }, {
            isRead: true,
        });
        return (0, ApiResponse_1.successResponse)(res, 200, "All notifications marked as read");
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to mark notifications as read");
    }
};
exports.markAllAsRead = markAllAsRead;
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification_1.Notification.countDocuments({
            recipient: req.user._id,
            isRead: false,
        });
        return (0, ApiResponse_1.successResponse)(res, 200, "Unread count fetched successfully", { count });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to fetch unread count");
    }
};
exports.getUnreadCount = getUnreadCount;
//# sourceMappingURL=notification.controller.js.map