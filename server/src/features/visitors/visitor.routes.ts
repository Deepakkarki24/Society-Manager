import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import {
  preApproveVisitor,
  getVisitors,
  checkInVisitor,
  checkOutVisitor,
  rejectVisitor,
} from './visitor.controller';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(getVisitors)
  .post(
    authorize('resident'),
    validate([
      body('name').notEmpty(),
      body('phone').notEmpty(),
      body('purpose').notEmpty(),
    ]),
    preApproveVisitor
  );

router.patch('/:id/check-in', authorize('society_admin'), checkInVisitor);
router.patch('/:id/check-out', authorize('society_admin'), checkOutVisitor);
router.patch('/:id/reject', authorize('society_admin'), rejectVisitor);

export default router;
