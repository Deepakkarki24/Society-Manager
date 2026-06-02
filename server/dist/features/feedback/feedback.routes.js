"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const feedback_controller_1 = require("./feedback.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, auth_1.authorize)('resident'), (0, validate_1.validate)([(0, express_validator_1.body)('subject').notEmpty(), (0, express_validator_1.body)('message').notEmpty()]), feedback_controller_1.submitFeedback);
router.get('/', (0, auth_1.authorize)('society_admin'), feedback_controller_1.getFeedback);
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map