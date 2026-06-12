import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createApp } from "./app";
import { connectDatabase, connectMongoDBAtlas } from "./config/database";
import { setSocketIO } from "./services/notification.service";
import { JwtPayload } from "./types";
import {
  CLIENT_URL,
  JWT_SECRET,
  MONGODB_URI,
  NODE_ENV,
  PORT,
} from "./config/env";

const Port = Number(PORT) || 3001;

if (NODE_ENV !== "production") {
  connectDatabase(MONGODB_URI || "");
} else {
  connectMongoDBAtlas();
}

const startServer = async () => {
  const app = createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  setSocketIO(io);

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie

    if (!cookies) return next(new Error("Authentication required"));

    const token = cookies
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
      socket.data.userId = decoded.userId;
      next();
    } catch {
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
