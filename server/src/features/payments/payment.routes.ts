// import { Router } from 'express';
// import { authenticate, authorize } from '../../middleware/auth';
// import { body } from 'express-validator';
// import { validate } from '../../middleware/validate';
// import {
//   generateInvoices,
//   getPayments,
//   recordPayment,
//   getPaymentSummary,
// } from './payment.controller';

// const router = Router();

// router.use(authenticate);

// router.get('/summary', authorize('society_admin'), getPaymentSummary);

// router
//   .route('/')
//   .get(getPayments)
//   .post(
//     authorize('society_admin'),
//     validate([
//       body('month').isInt({ min: 1, max: 12 }),
//       body('year').isInt({ min: 2020 }),
//     ]),
//     generateInvoices
//   );

// router.patch(
//   '/:id/pay',
//   authorize('resident', 'society_admin'),
//   recordPayment
// );

// export default router;
