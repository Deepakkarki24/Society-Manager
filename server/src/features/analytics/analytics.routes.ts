import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { getDashboardAnalytics, getSuperAdminAnalytics } from './analytics.controller';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardAnalytics);
router.get('/platform', authorize('super_admin'), getSuperAdminAnalytics);

export default router;
