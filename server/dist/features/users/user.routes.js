"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/staff', (0, auth_1.authorize)('society_admin'), user_controller_1.getMaintenanceStaff);
router
    .route('/')
    .get((0, auth_1.authorize)('super_admin', 'society_admin'), user_controller_1.getUsers)
    .post((0, auth_1.authorize)('super_admin', 'society_admin'), (0, validate_1.validate)([
    (0, express_validator_1.body)('name').notEmpty(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('role').isIn(['society_admin', 'resident', 'maintenance_staff']),
]), user_controller_1.createUser);
router.post('/family', (0, auth_1.authorize)('resident'), (0, validate_1.validate)([
    (0, express_validator_1.body)('name').notEmpty(),
    (0, express_validator_1.body)('relation').notEmpty(),
]), user_controller_1.addFamilyMember);
router.delete('/family/:memberId', (0, auth_1.authorize)('resident'), user_controller_1.removeFamilyMember);
router
    .route('/:id')
    .get((0, auth_1.authorize)('super_admin', 'society_admin'), user_controller_1.getUser)
    .patch((0, auth_1.authorize)('super_admin', 'society_admin'), user_controller_1.updateUser)
    .delete((0, auth_1.authorize)('super_admin', 'society_admin'), user_controller_1.deactivateUser);
router.post('/:id/family', (0, auth_1.authorize)('society_admin'), (0, validate_1.validate)([(0, express_validator_1.body)('name').notEmpty(), (0, express_validator_1.body)('relation').notEmpty()]), user_controller_1.addFamilyMember);
router.delete('/:id/family/:memberId', (0, auth_1.authorize)('society_admin', 'resident'), user_controller_1.removeFamilyMember);
exports.default = router;
//# sourceMappingURL=user.routes.js.map