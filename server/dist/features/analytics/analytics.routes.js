"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/dashboard', analytics_controller_1.getDashboardAnalytics);
router.get('/platform', (0, auth_1.authorize)('super_admin'), analytics_controller_1.getSuperAdminAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map