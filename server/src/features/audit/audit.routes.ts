import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { getAuditLogs } from './audit.controller';

const router = Router();

router.use(authenticate, authorize('super_admin', 'society_admin'));
router.get('/', getAuditLogs);

export default router;
