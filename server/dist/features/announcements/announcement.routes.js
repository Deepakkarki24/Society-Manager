"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const announcement_controller_1 = require("./announcement.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router
    .route('/')
    .get(announcement_controller_1.getAnnouncements)
    .post((0, auth_1.authorize)('society_admin'), (0, validate_1.validate)([(0, express_validator_1.body)('title').notEmpty(), (0, express_validator_1.body)('content').notEmpty()]), announcement_controller_1.createAnnouncement);
router
    .route('/:id')
    .get(announcement_controller_1.getAnnouncement)
    .patch((0, auth_1.authorize)('society_admin'), announcement_controller_1.updateAnnouncement)
    .delete((0, auth_1.authorize)('society_admin'), announcement_controller_1.deleteAnnouncement);
exports.default = router;
//# sourceMappingURL=announcement.routes.js.map