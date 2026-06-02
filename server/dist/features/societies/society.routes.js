"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const society_controller_1 = require("./society.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router
    .route('/')
    .get((0, auth_1.authorize)('super_admin', 'society_admin'), society_controller_1.getSocieties)
    .post((0, auth_1.authorize)('super_admin'), (0, validate_1.validate)([
    (0, express_validator_1.body)('name').notEmpty(),
    (0, express_validator_1.body)('address').notEmpty(),
    (0, express_validator_1.body)('city').notEmpty(),
    (0, express_validator_1.body)('state').notEmpty(),
    (0, express_validator_1.body)('pincode').notEmpty(),
    (0, express_validator_1.body)('totalFlats').isInt({ min: 1 }),
]), society_controller_1.createSociety);
router.get('/:id/stats', (0, auth_1.authorize)('super_admin', 'society_admin'), society_controller_1.getSocietyStats);
router
    .route('/:id')
    .get(society_controller_1.getSociety)
    .patch((0, auth_1.authorize)('super_admin'), society_controller_1.updateSociety)
    .delete((0, auth_1.authorize)('super_admin'), society_controller_1.deleteSociety);
router.post('/:id/assign-admin', (0, auth_1.authorize)('super_admin'), (0, validate_1.validate)([(0, express_validator_1.body)('userId').isMongoId()]), society_controller_1.assignSocietyAdmin);
exports.default = router;
//# sourceMappingURL=society.routes.js.map