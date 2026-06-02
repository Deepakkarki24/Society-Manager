"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../../middleware/validate");
const upload_1 = require("../../middleware/upload");
const complaint_controller_1 = require("./complaint.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/history', (0, auth_1.authorize)('resident'), complaint_controller_1.getComplaintHistory);
router
    .route('/')
    .get(complaint_controller_1.getComplaints)
    .post((0, auth_1.authorize)('resident'), upload_1.upload.array('images', 5), (0, validate_1.validate)([
    (0, express_validator_1.body)('title').notEmpty(),
    (0, express_validator_1.body)('description').notEmpty(),
    (0, express_validator_1.body)('category').isIn([
        'water',
        'electricity',
        'security',
        'lift',
        'parking',
        'cleaning',
        'maintenance',
        'other',
    ]),
    (0, express_validator_1.body)('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
]), complaint_controller_1.createComplaint);
router.get('/:id', complaint_controller_1.getComplaint);
router.patch('/:id/assign', (0, auth_1.authorize)('society_admin'), (0, validate_1.validate)([(0, express_validator_1.body)('assignedTo').isMongoId()]), complaint_controller_1.assignComplaint);
router.patch('/:id/status', (0, auth_1.authorize)('society_admin', 'maintenance_staff'), upload_1.upload.array('completionProof', 5), (0, validate_1.validate)([(0, express_validator_1.body)('status').isIn(['assigned', 'in_progress', 'resolved'])]), complaint_controller_1.updateComplaintStatus);
router.post('/:id/reopen', (0, auth_1.authorize)('resident'), complaint_controller_1.reopenComplaint);
router.post('/:id/comments', (0, validate_1.validate)([(0, express_validator_1.body)('text').notEmpty()]), complaint_controller_1.addComment);
exports.default = router;
//# sourceMappingURL=complaint.routes.js.map