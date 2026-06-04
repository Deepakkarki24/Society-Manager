export type UserRole =
  | "super_admin"
  | "society_admin"
  | "resident"
  | "maintenance_staff";

export type ComplaintStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "reopened";

export type ComplaintCategory =
  | "water"
  | "electricity"
  | "security"
  | "lift"
  | "parking"
  | "cleaning"
  | "maintenance"
  | "other";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  society?: string | Society;
  flatNumber?: string;
  block?: string;
  avatar?: string;
  phone?: string;
  familyMembers?: FamilyMember[];
}

export interface Society {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalFlats: number;
  maintenanceAmount: number;
  isActive: boolean;
}

export interface FamilyMember {
  _id?: string;
  name: string;
  relation: string;
  phone?: string;
  age?: number;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: string;
  status: ComplaintStatus;
  society: string;
  createdBy: User | string;
  assignedTo?: User | string;
  images: string[];
  completionProof: string[];
  comments: ComplaintComment[];
  timeline: ComplaintTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintComment {
  _id?: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface ComplaintTimeline {
  status: ComplaintStatus;
  note?: string;
  updatedBy: User;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  isImportant: boolean;
  isEvent: boolean;
  eventDate?: string;
  createdBy: User;
  createdAt: string;
}

export interface Visitor {
  _id: string;
  name: string;
  phone: string;
  purpose: string;
  status: string;
  flatNumber: string;
  expectedArrival?: string;
  checkInAt?: string;
  checkOutAt?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  amount: number;
  month: number;
  year: number;
  status: string;
  dueDate: string;
  paidAt?: string;
  resident?: User;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
}

export interface DashboardAnalytics {
  complaints: {
    total: number;
    resolved: number;
    pending: number;
    resolutionRate: number;
  };
  categoryStats: { _id: string; count: number }[];
  monthlyTrends: {
    _id: { year: number; month: number };
    count: number;
    resolved: number;
  }[];
  residents: { total: number };
  societies: { total: number };
  payments: { _id: string; count: number; amount: number }[];
  engagement: { announcementsLast30Days: number; activeResidents: number };
}
