import { Bell, Menu, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useAppSelector((s) => s.notifications);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold lg:hidden text-primary-600">
          SIMP
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/notifications")}
          className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <div className="ml-2 hidden items-center gap-2 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium dark:text-white">{user?.name}</p>
            <p className="text-xs capitalize text-gray-500">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
