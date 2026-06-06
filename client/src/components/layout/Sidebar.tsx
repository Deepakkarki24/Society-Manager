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
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', type: "dashboard", icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
  { to: '/societies', type: "societies", icon: Building2, label: 'Societies', roles: ['super_admin'] },
  { to: '/users', type: "users", icon: Users, label: 'Users', roles: ['super_admin', 'society_admin'] },
  { to: '/complaints', type: "complaints", icon: MessageSquareWarning, label: 'Complaints', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
  { to: '/announcements', type: "announcements", icon: Megaphone, label: 'Announcements', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
  { to: '/visitors', type: "visitors", icon: UserCheck, label: 'Visitors', roles: ['society_admin', 'resident'] },
  { to: '/payments', type: "payments", icon: CreditCard, label: 'Payments', roles: ['society_admin', 'resident'] },
  { to: '/analytics', type: "analytics", icon: BarChart3, label: 'Analytics', roles: ['super_admin', 'society_admin'] },
  { to: '/audit-logs', type: "audit-logs", icon: ClipboardList, label: 'Audit Logs', roles: ['super_admin', 'society_admin'] },
  { to: '/settings', type: "settings", icon: Settings, label: 'Settings', roles: ['super_admin', 'society_admin', 'resident', 'maintenance_staff'] },
];

export const Sidebar = ({ role }: { role: UserRole }) => {
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <span className="text-xl font-bold text-primary-600">SIMP</span>
      </div>
      <nav className="space-y-1 p-4">
        {filtered.map(({ to, icon: Icon, label, type }) => (
          <div className='relative' key={type}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 ${(type === "visitors" || type === 'payments') && "cursor-not-allowed opacity-50"} rounded-lg overflow-hidden px-3 py-2 text-sm font-medium transition ${isActive
                  ? 'dark:bg-white/15 bg-black/10 backdrop-blur-sm dark:text-primary-400'
                  : 'text-gray-600 hover:bg-black/10 dark:text-gray-400 dark:hover:bg-white/10'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}

            </NavLink>
            {(type === "visitors" || type === 'payments') && <span className='absolute w-full h-full text-xs tracking-wide text-blue-500 cursor-not-allowed top-0 left-0 flex justify-end p-2 items-center font-semibold z-9999'>Coming soon</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};
