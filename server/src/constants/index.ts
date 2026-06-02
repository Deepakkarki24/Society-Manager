export const USER_ROLES = [
  'super_admin',
  'society_admin',
  'resident',
  'maintenance_staff',
] as const;

export const COMPLAINT_STATUSES = [
  'pending',
  'assigned',
  'in_progress',
  'resolved',
  'reopened',
] as const;

export const COMPLAINT_CATEGORIES = [
  'water',
  'electricity',
  'security',
  'lift',
  'parking',
  'cleaning',
  'maintenance',
  'other',
] as const;

export const COMPLAINT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'overdue', 'partial'] as const;

export const VISITOR_STATUSES = [
  'pre_approved',
  'checked_in',
  'checked_out',
  'rejected',
] as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;
