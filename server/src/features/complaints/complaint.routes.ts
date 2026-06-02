import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import { upload } from '../../middleware/upload';
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

const router = Router();

router.use(authenticate);

router.get('/history', authorize('resident'), getComplaintHistory);

router
  .route('/')
  .get(getComplaints)
  .post(
    authorize('resident'),
    upload.array('images', 5),
    validate([
      body('title').notEmpty(),
      body('description').notEmpty(),
      body('category').isIn([
        'water',
        'electricity',
        'security',
        'lift',
        'parking',
        'cleaning',
        'maintenance',
        'other',
      ]),
      body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    ]),
    createComplaint
  );

router.get('/:id', getComplaint);

router.patch(
  '/:id/assign',
  authorize('society_admin'),
  validate([body('assignedTo').isMongoId()]),
  assignComplaint
);

router.patch(
  '/:id/status',
  authorize('society_admin', 'maintenance_staff'),
  upload.array('completionProof', 5),
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
