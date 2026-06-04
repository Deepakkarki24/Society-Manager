"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// need to add middleware
router.post("/register", auth_validation_1.registerValidation, auth_controller_1.register);
router.post("/login", auth_validation_1.loginValidation, auth_controller_1.login);
router.get("/me", auth_controller_1.getMe);
router.patch("/profile", auth_controller_1.updateProfile);
router.patch("/change-password", [
    (0, express_validator_1.body)("currentPassword").notEmpty(),
    (0, express_validator_1.body)("newPassword").isLength({ min: 6 }),
], auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map