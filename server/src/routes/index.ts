import { Router } from "express";
import authRoutes from "../features/auth/auth.routes";
import societyRoutes from "../features/societies/society.routes";
import societyPublicRoutes from "../features/societies/society.public";
import userRoutes from "../features/users/user.routes";
import complaintRoutes from "../features/complaints/complaint.routes";
import announcementRoutes from "../features/announcements/announcement.routes";
// import visitorRoutes from "../features/visitors/visitor.routes";
// import paymentRoutes from "../features/payments/payment.routes";
import notificationRoutes from "../features/notifications/notification.routes";
import analyticsRoutes from "../features/analytics/analytics.routes";
import feedbackRoutes from "../features/feedback/feedback.routes";
import auditRoutes from "../features/audit/audit.routes";

const router = Router();

// router.get('/health', (_req, res) => {
//   res.json({ success: true, message: 'SIMP API is running' });
// });

router.use("/auth", authRoutes);
router.use("/societies", societyPublicRoutes);
router.use("/societies", societyRoutes);
router.use("/users", userRoutes);
router.use("/complaints", complaintRoutes);
router.use("/announcements", announcementRoutes);
// router.use("/visitors", visitorRoutes);
// router.use("/payments", paymentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/audit-logs", auditRoutes);

export default router;
