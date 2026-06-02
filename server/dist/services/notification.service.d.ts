import { Server } from 'socket.io';
export declare const setSocketIO: (socketServer: Server) => void;
export declare const createNotification: (params: {
    recipientId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
    metadata?: Record<string, unknown>;
}) => Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map