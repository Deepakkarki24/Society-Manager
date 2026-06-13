"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_API_KEY = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_CLOUD_NAME = exports.CLOUDINARY_API_KEY = exports.CLIENT_URL = exports.JWT_SECRET = exports.JWT_EXPIRES_IN = exports.MONGODB_USERNAME = exports.MONGODB_URI = exports.MONGODB_PASSWORD = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ENV = process.env;
// enviornments
const PORT = ENV.PORT;
exports.PORT = PORT;
const CLIENT_URL = ENV.CLIENT_URL;
exports.CLIENT_URL = CLIENT_URL;
const NODE_ENV = ENV.NODE_ENV;
exports.NODE_ENV = NODE_ENV;
const MONGODB_URI = ENV.MONGODB_URI;
exports.MONGODB_URI = MONGODB_URI;
const MONGODB_USERNAME = ENV.MONGODB_USERNAME;
exports.MONGODB_USERNAME = MONGODB_USERNAME;
const MONGODB_PASSWORD = ENV.MONGODB_PASSWORD;
exports.MONGODB_PASSWORD = MONGODB_PASSWORD;
const JWT_SECRET = ENV.JWT_SECRET;
exports.JWT_SECRET = JWT_SECRET;
const JWT_EXPIRES_IN = ENV.JWT_EXPIRES_IN;
exports.JWT_EXPIRES_IN = JWT_EXPIRES_IN;
const CLOUDINARY_CLOUD_NAME = ENV.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = ENV.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_KEY = CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = ENV.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET;
const GOOGLE_API_KEY = ENV.GOOGLE_API_KEY;
exports.GOOGLE_API_KEY = GOOGLE_API_KEY;
//# sourceMappingURL=env.js.map