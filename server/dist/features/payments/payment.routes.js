"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/summary', (0, auth_1.authorize)('society_admin'), payment_controller_1.getPaymentSummary);
router
    .route('/')
    .get(payment_controller_1.getPayments)
    .post((0, auth_1.authorize)('society_admin'), (0, validate_1.validate)([
    (0, express_validator_1.body)('month').isInt({ min: 1, max: 12 }),
    (0, express_validator_1.body)('year').isInt({ min: 2020 }),
]), payment_controller_1.generateInvoices);
router.patch('/:id/pay', (0, auth_1.authorize)('resident', 'society_admin'), payment_controller_1.recordPayment);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map