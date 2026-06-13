"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDBAtlas = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDatabase = async (uri) => {
    if (!uri) {
        throw new Error("MONGODB_URI is not defined");
    }
    await mongoose_1.default.connect(uri);
    console.log("DB is connected");
};
exports.connectDatabase = connectDatabase;
const connectMongoDBAtlas = async () => {
    try {
        const username = encodeURIComponent(env_1.MONGODB_USERNAME || "");
        const password = encodeURIComponent(env_1.MONGODB_PASSWORD || "");
        const uri = `mongodb+srv://${username}:${password}@cluster0.ugyic8h.mongodb.net/simp`;
        await mongoose_1.default.connect(uri);
        console.log("Connected to MongoDB Atlas with Mongoose");
    }
    catch (error) {
        console.error(" MongoDB Atlas connection error:", error);
        process.exit(1);
    }
};
exports.connectMongoDBAtlas = connectMongoDBAtlas;
//# sourceMappingURL=database.js.map