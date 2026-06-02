"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_LIMIT = exports.DEFAULT_LIMIT = exports.DEFAULT_PAGE = exports.VISITOR_STATUSES = exports.PAYMENT_STATUSES = exports.COMPLAINT_PRIORITIES = exports.COMPLAINT_CATEGORIES = exports.COMPLAINT_STATUSES = exports.USER_ROLES = void 0;
exports.USER_ROLES = [
    'super_admin',
    'society_admin',
    'resident',
    'maintenance_staff',
];
exports.COMPLAINT_STATUSES = [
    'pending',
    'assigned',
    'in_progress',
    'resolved',
    'reopened',
];
exports.COMPLAINT_CATEGORIES = [
    'water',
    'electricity',
    'security',
    'lift',
    'parking',
    'cleaning',
    'maintenance',
    'other',
];
exports.COMPLAINT_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
exports.PAYMENT_STATUSES = ['pending', 'paid', 'overdue', 'partial'];
exports.VISITOR_STATUSES = [
    'pre_approved',
    'checked_in',
    'checked_out',
    'rejected',
];
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT = 10;
exports.MAX_LIMIT = 100;
//# sourceMappingURL=index.js.map