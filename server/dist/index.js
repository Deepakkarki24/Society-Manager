"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("./app");
const database_1 = require("./config/database");
const notification_service_1 = require("./services/notification.service");
const env_1 = require("./config/env");
const Port = Number(env_1.PORT) || 3001;
if (env_1.NODE_ENV !== "production") {
    (0, database_1.connectDatabase)(env_1.MONGODB_URI || "");
}
else {
    (0, database_1.connectMongoDBAtlas)();
}
const startServer = async () => {
    const app = (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: env_1.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });
    (0, notification_service_1.setSocketIO)(io);
    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies)
            return next(new Error("Authentication required"));
        const token = cookies
            .split(";")
            .find((c) => c.trim().startsWith("token="))
            ?.split("=")[1];
        if (!token) {
            return next(new Error("Authentication required"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
            socket.data.userId = decoded.userId;
            next();
        }
        catch {
            next(new Error("Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);
        if (socket.handshake.query.societyId) {
            socket.join(`society:${socket.handshake.query.societyId}`);
        }
        socket.on("disconnect", () => {
            socket.leave(`user:${userId}`);
        });
    });
    server.listen(Port, () => {
        console.log(`Server running on port ${Port}`);
    });
};
startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map