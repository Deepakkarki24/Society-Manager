import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import { submitFeedback, getFeedback } from './feedback.controller';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('resident'),
  validate([body('subject').notEmpty(), body('message').notEmpty()]),
  submitFeedback
);

router.get('/', authorize('society_admin'), getFeedback);

export default router;
