"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_controller_1 = require("./audit.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)('super_admin', 'society_admin'));
router.get('/', audit_controller_1.getAuditLogs);
exports.default = router;
//# sourceMappingURL=audit.routes.js.map