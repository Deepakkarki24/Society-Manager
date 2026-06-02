import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquareWarning,
  Megaphone,
  UserCheck,
  CreditCard,
  Settings,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import type { UserRole } from '@/types';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
  { to: '/societies', icon: Building2, label: 'Societies', roles: ['super_admin'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['super_admin', 'society_admin'] },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
  { to: '/announcements', icon: Megaphone, label: 'Announcements', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
  { to: '/visitors', icon: UserCheck, label: 'Visitors', roles: ['society_admin', 'resident'] },
  { to: '/payments', icon: CreditCard, label: 'Payments', roles: ['society_admin', 'resident'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['super_admin', 'society_admin'] },
  { to: '/audit-logs', icon: ClipboardList, label: 'Audit Logs', roles: ['super_admin', 'society_admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
];

export const Sidebar = ({ role }: { role: UserRole }) => {
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <span className="text-xl font-bold text-primary-600">SIMP</span>
      </div>
      <nav className="space-y-1 p-4">
        {filtered.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
