"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerValidation), auth_controller_1.register);
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginValidation), auth_controller_1.login);
router.get('/me', auth_1.authenticate, auth_controller_1.getMe);
router.patch('/profile', auth_1.authenticate, auth_controller_1.updateProfile);
router.patch('/change-password', auth_1.authenticate, (0, validate_1.validate)([
    (0, express_validator_1.body)('currentPassword').notEmpty(),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }),
]), auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map