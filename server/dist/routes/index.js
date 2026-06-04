"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../features/auth/auth.routes"));
const society_routes_1 = __importDefault(require("../features/societies/society.routes"));
const society_public_1 = __importDefault(require("../features/societies/society.public"));
const user_routes_1 = __importDefault(require("../features/users/user.routes"));
const complaint_routes_1 = __importDefault(require("../features/complaints/complaint.routes"));
const announcement_routes_1 = __importDefault(require("../features/announcements/announcement.routes"));
const visitor_routes_1 = __importDefault(require("../features/visitors/visitor.routes"));
const payment_routes_1 = __importDefault(require("../features/payments/payment.routes"));
const notification_routes_1 = __importDefault(require("../features/notifications/notification.routes"));
const analytics_routes_1 = __importDefault(require("../features/analytics/analytics.routes"));
const feedback_routes_1 = __importDefault(require("../features/feedback/feedback.routes"));
const audit_routes_1 = __importDefault(require("../features/audit/audit.routes"));
const router = (0, express_1.Router)();
// router.get('/health', (_req, res) => {
//   res.json({ success: true, message: 'SIMP API is running' });
// });
router.use("/auth", auth_routes_1.default);
router.use("/societies", society_public_1.default);
router.use("/societies", society_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/complaints", complaint_routes_1.default);
router.use("/announcements", announcement_routes_1.default);
router.use("/visitors", visitor_routes_1.default);
router.use("/payments", payment_routes_1.default);
router.use("/notifications", notification_routes_1.default);
router.use("/analytics", analytics_routes_1.default);
router.use("/feedback", feedback_routes_1.default);
router.use("/audit-logs", audit_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map