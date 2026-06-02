"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const createAuditLog = async (req, action, entity, entityId, details) => {
    if (!req.user)
        return;
    await models_1.AuditLog.create({
        user: req.user._id,
        action,
        entity,
        entityId: entityId ? new mongoose_1.default.Types.ObjectId(entityId) : undefined,
        society: req.user.society
            ? new mongoose_1.default.Types.ObjectId(req.user.society)
            : details?.societyId
                ? new mongoose_1.default.Types.ObjectId(details.societyId)
                : undefined,
        details,
        ip: req.ip,
    });
};
exports.createAuditLog = createAuditLog;
//# sourceMappingURL=audit.service.js.map