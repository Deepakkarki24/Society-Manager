import { Server } from 'socket.io';
import { Notification } from '../models/Notification';

let io: Server | null = null;

export const setSocketIO = (socketServer: Server): void => {
  io = socketServer;
};

export const createNotification = async (params: {
  recipientId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> => {
  const notification = await Notification.create({
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
