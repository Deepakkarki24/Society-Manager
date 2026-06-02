import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deactivateUser,
  addFamilyMember,
  removeFamilyMember,
  getMaintenanceStaff,
} from './user.controller';

const router = Router();

router.use(authenticate);

router.get('/staff', authorize('society_admin'), getMaintenanceStaff);

router
  .route('/')
  .get(authorize('super_admin', 'society_admin'), getUsers)
  .post(
    authorize('super_admin', 'society_admin'),
    validate([
      body('name').notEmpty(),
      body('email').isEmail(),
      body('password').isLength({ min: 6 }),
      body('role').isIn(['society_admin', 'resident', 'maintenance_staff']),
    ]),
    createUser
  );

router.post(
  '/family',
  authorize('resident'),
  validate([
    body('name').notEmpty(),
    body('relation').notEmpty(),
  ]),
  addFamilyMember
);

router.delete('/family/:memberId', authorize('resident'), removeFamilyMember);

router
  .route('/:id')
  .get(authorize('super_admin', 'society_admin'), getUser)
  .patch(authorize('super_admin', 'society_admin'), updateUser)
  .delete(authorize('super_admin', 'society_admin'), deactivateUser);

router.post(
  '/:id/family',
  authorize('society_admin'),
  validate([body('name').notEmpty(), body('relation').notEmpty()]),
  addFamilyMember
);

router.delete(
  '/:id/family/:memberId',
  authorize('society_admin', 'resident'),
  removeFamilyMember
);

export default router;
