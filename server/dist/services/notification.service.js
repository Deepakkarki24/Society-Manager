"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.setSocketIO = void 0;
const Notification_1 = require("../models/Notification");
let io = null;
const setSocketIO = (socketServer) => {
    io = socketServer;
};
exports.setSocketIO = setSocketIO;
const createNotification = async (params) => {
    const notification = await Notification_1.Notification.create({
        recipient: params.recipientId,
        title: params.title,
        message: params.message,
        type: params.type,
        link: params.link,
        metadata: params.metadata,
    });
    if (io) {
        io.to(`user:${params.recipientId}`).emit('notification', {
            _id: notification._id,
            title: params.title,
            message: params.message,
            type: params.type,
            link: params.link,
            createdAt: notification.createdAt,
        });
    }
};
exports.createNotification = createNotification;
//# sourceMappingURL=notification.service.js.map