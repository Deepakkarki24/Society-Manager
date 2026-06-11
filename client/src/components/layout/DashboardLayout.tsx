import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarMobile } from "./Sidebar";
import { Header } from "./Header";
import { useAppSelector } from "@/store/hooks";
import { useSocket } from "@/hooks/useSocket";

export const DashboardLayout = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  useSocket();

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={user.role} />
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900">
            <SidebarMobile role={user.role} />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col h-full">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex flex-1 p-4 lg:p-6 max-h-[90dvh] h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
