export type UserRole =
  | 'super_admin'
  | 'society_admin'
  | 'resident'
  | 'maintenance_staff';

export type ComplaintStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'reopened';

export type ComplaintCategory =
  | 'water'
  | 'electricity'
  | 'security'
  | 'lift'
  | 'parking'
  | 'cleaning'
  | 'maintenance'
  | 'other';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial';

export type VisitorStatus = 'pre_approved' | 'checked_in' | 'checked_out' | 'rejected';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  societyId?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
