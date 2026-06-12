import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from './notification.controller';

const router = Router();

router.use(authenticate);

router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

export default router;
