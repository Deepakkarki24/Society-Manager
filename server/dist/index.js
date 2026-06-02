"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("./app");
const database_1 = require("./config/database");
const notification_service_1 = require("./services/notification.service");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, database_1.connectDatabase)();
    const app = (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
        },
    });
    (0, notification_service_1.setSocketIO)(io);
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error('Authentication required'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.userId = decoded.userId;
            next();
        }
        catch {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);
        if (socket.handshake.query.societyId) {
            socket.join(`society:${socket.handshake.query.societyId}`);
        }
        socket.on('disconnect', () => {
            socket.leave(`user:${userId}`);
        });
    });
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map