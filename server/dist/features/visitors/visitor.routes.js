"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const visitor_controller_1 = require("./visitor.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router
    .route('/')
    .get(visitor_controller_1.getVisitors)
    .post((0, auth_1.authorize)('resident'), (0, validate_1.validate)([
    (0, express_validator_1.body)('name').notEmpty(),
    (0, express_validator_1.body)('phone').notEmpty(),
    (0, express_validator_1.body)('purpose').notEmpty(),
]), visitor_controller_1.preApproveVisitor);
router.patch('/:id/check-in', (0, auth_1.authorize)('society_admin'), visitor_controller_1.checkInVisitor);
router.patch('/:id/check-out', (0, auth_1.authorize)('society_admin'), visitor_controller_1.checkOutVisitor);
router.patch('/:id/reject', (0, auth_1.authorize)('society_admin'), visitor_controller_1.rejectVisitor);
exports.default = router;
//# sourceMappingURL=visitor.routes.js.map