import { Bell, Menu, LogOut, Building2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import type React from "react";


interface HeaderProps {
  setShowLogoutModal: (val: boolean) => void;
  onMenuClick?: () => void
}


export const Header: React.FC<HeaderProps> = ({ onMenuClick, setShowLogoutModal }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useAppSelector((s) => s.notifications);




  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-[#1F1F1F] backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg flex items-center gap-2 font-semibold lg:hidden text-gradient-primary">
          <Building2 className="h-7 w-7 text-primary-400" />
          SIMP
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/notifications")}
          className="relative rounded-lg p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <div className="ml-2 items-center gap-2 flex">
          <div className="text-right">
            <p className="sm:text-sm text-xs font-medium text-text-primary">{user?.name}</p>
            <p className="text-xs capitalize text-text-muted">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
