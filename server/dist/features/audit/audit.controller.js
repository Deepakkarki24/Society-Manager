"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const models_1 = require("../../models");
const pagination_1 = require("../../utils/pagination");
const getAuditLogs = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const filter = {};
    if (req.user.role !== "super_admin") {
        filter.society = req.user.society;
    }
    else if (req.query.societyId) {
        filter.society = req.query.societyId;
    }
    if (req.query.entity)
        filter.entity = req.query.entity;
    if (req.query.action)
        filter.action = req.query.action;
    const [logs, total] = await Promise.all([
        models_1.AuditLog.find(filter)
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.AuditLog.countDocuments(filter),
    ]);
    res.json({ success: true, ...(0, pagination_1.paginatedResponse)(logs, total, page, limit) });
};
exports.getAuditLogs = getAuditLogs;
//# sourceMappingURL=audit.controller.js.map