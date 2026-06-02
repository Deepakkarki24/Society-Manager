import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from './announcement.controller';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(getAnnouncements)
  .post(
    authorize('society_admin'),
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    createAnnouncement
  );

router
  .route('/:id')
  .get(getAnnouncement)
  .patch(authorize('society_admin'), updateAnnouncement)
  .delete(authorize('society_admin'), deleteAnnouncement);

export default router;
