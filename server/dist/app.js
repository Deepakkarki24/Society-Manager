"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const cloudinary_1 = require("./config/cloudinary");
const env_1 = require("./config/env");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cookie_parser_1.default)());
    (0, cloudinary_1.configureCloudinary)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: [(env_1.CLIENT_URL || "http://localhost:5173"), "http://192.168.43.35:5173/"],
        credentials: true,
    }));
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/api", routes_1.default);
    app.use(errorHandler_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map