import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import {
  createComplaint,
  getComplaints,
  getComplaint,
  assignComplaint,
  updateComplaintStatus,
  reopenComplaint,
  addComment,
  getComplaintHistory,
} from './complaint.controller';
import { uploadMultipleImages, uploadSingleImage } from '../../middleware/upload';

const router = Router();

router.use(authenticate);

router.get('/history', authorize('resident'), getComplaintHistory);

router.post("/create", authorize('resident'), uploadSingleImage, createComplaint);

router.get('/:id', getComplaint);
router.get('/', getComplaints);

router.patch(
  '/:id/assign',
  authorize('society_admin'),
  validate([body('assignedTo').isMongoId()]),
  assignComplaint
);

router.patch(
  '/:id/status',
  authorize('society_admin', 'maintenance_staff'),
  uploadMultipleImages,
  validate([body('status').isIn(['assigned', 'in_progress', 'resolved'])]),
  updateComplaintStatus
);

router.post(
  '/:id/reopen',
  authorize('resident'),
  reopenComplaint
);

router.post(
  '/:id/comments',
  validate([body('text').notEmpty()]),
  addComment
);

export default router;
