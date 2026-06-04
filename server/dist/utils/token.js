"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (userId, role, societyId) => {
    const secret = env_1.JWT_SECRET;
    const expiresIn = env_1.JWT_EXPIRES_IN || "7d";
    return jsonwebtoken_1.default.sign({ userId, role, societyId }, secret, {
        expiresIn: expiresIn,
    });
};
exports.signToken = signToken;
//# sourceMappingURL=token.js.map