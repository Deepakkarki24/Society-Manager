"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const getNotifications = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const filter = { recipient: req.user._id };
    if (req.query.unread === "true")
        Object.assign(filter, { isRead: false });
    const [notifications, total] = await Promise.all([
        models_1.Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        models_1.Notification.countDocuments(filter),
    ]);
    res.json({
        success: true,
        ...(0, pagination_1.paginatedResponse)(notifications, total, page, limit),
    });
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    const notification = await models_1.Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true }, { new: true });
    if (!notification)
        throw new ApiError_1.ApiError(404, "Notification not found");
    res.json({ success: true, data: notification });
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    await models_1.Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
};
exports.markAllAsRead = markAllAsRead;
const getUnreadCount = async (req, res) => {
    const count = await models_1.Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });
    res.json({ success: true, data: { count } });
};
exports.getUnreadCount = getUnreadCount;
//# sourceMappingURL=notification.controller.js.map