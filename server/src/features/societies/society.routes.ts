import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import {
  createSociety,
  getSocieties,
  getSociety,
  updateSociety,
  deleteSociety,
  assignSocietyAdmin,
  getSocietyStats,
} from './society.controller';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(authorize('super_admin', 'society_admin'), getSocieties)
  .post(
    authorize('super_admin'),
    validate([
      body('name').notEmpty(),
      body('address').notEmpty(),
      body('city').notEmpty(),
      body('state').notEmpty(),
      body('pincode').notEmpty(),
      body('totalFlats').isInt({ min: 1 }),
    ]),
    createSociety
  );

router.get('/:id/stats', authorize('super_admin', 'society_admin'), getSocietyStats);

router
  .route('/:id')
  .get(getSociety)
  .patch(authorize('super_admin'), updateSociety)
  .delete(authorize('super_admin'), deleteSociety);

router.post(
  '/:id/assign-admin',
  authorize('super_admin'),
  validate([body('userId').isMongoId()]),
  assignSocietyAdmin
);

export default router;
