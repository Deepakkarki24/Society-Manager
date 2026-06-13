import { NavLink, useNavigate } from 'react-router-dom';
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
import type React from 'react';
import { RobotIcon } from '@phosphor-icons/react';

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

interface SidebarProps {
  role: UserRole,
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const filtered = navItems.filter((item) => item.roles.includes(role));

  const navigate = useNavigate()

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-border-subtle bg-[#1F1F1F]">
      <div onClick={() => navigate('/')}
        className="w-fit flex cursor-pointer gap-2 text-gradient-primary h-16 items-center px-6">
        <Building2 className="h-8 w-8 text-primary-400" />
        <span className="text-xl font-bold tracking-tight">SIMP</span>
      </div>
      <nav className="space-y-1 p-4">
        {filtered.map(({ to, icon: Icon, label, type }) => (
          <div className='relative' key={type}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 ${(type === "visitors" || type === 'payments') && "cursor-not-allowed opacity-50"} overflow-hidden px-3 py-2.5 text-xs font-medium tracking-wider transition-all duration-200 ${isActive
                  ? 'bg-black/30 text-white/90 rounded-xl shadow-sm shadow-primary-600/10'
                  : 'text-white/80 hover:bg-surface-hover hover:text-text-primary'
                }`
              }
            >
              {
                role === "resident" && type === "complaints"
                  ? <div className='flex items-center gap-2'>
                    <Icon className="h-5 w-5" />
                    Your Complaints
                  </div>
                  : role === "resident" && type === "dashboard"
                    ? <div className='flex items-center gap-2'>
                      <RobotIcon size={22} className="text-primary-400" />
                      AI Assistant
                    </div>
                    : <div className='flex items-center gap-2'>
                      <Icon className="h-5 w-5" />
                      {label}
                    </div>
              }

            </NavLink>
            {(type === "visitors" || type === 'payments') && <span className='absolute w-full h-full text-xs tracking-wide text-primary-400 cursor-not-allowed top-0 left-0 flex justify-end p-2 items-center font-semibold z-9999'>Coming soon</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};

interface SidebarMobileProps {
  role: UserRole,
}

export const SidebarMobile: React.FC<SidebarMobileProps> = ({ role }) => {
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="block lg:hidden w-64 shrink-0 border-r border-border-subtle bg-surface-elevated">
      <div className="flex h-16 items-center border-b border-border-subtle px-6">
        <span className="text-xl font-bold text-gradient-primary">SIMP</span>
      </div>
      <nav className="space-y-1 p-4">
        {filtered.map(({ to, icon: Icon, label, type }) => (
          <div className='relative' key={type}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 ${(type === "visitors" || type === 'payments') && "cursor-not-allowed opacity-50"} rounded-lg overflow-hidden px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-gradient-primary/15 text-primary-300 ring-1 ring-primary-400/25'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}

            </NavLink>
            {(type === "visitors" || type === 'payments') && <span className='absolute w-full h-full text-[10px] sm:text-xs tracking-wide text-primary-500/80 cursor-not-allowed top-0 left-0 flex justify-end p-2 items-center font-semibold z-9999'>Coming soon</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};
