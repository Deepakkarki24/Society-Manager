import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ComplaintsPage } from "@/pages/complaints/ComplaintsPage";
import { CreateComplaintPage } from "@/pages/complaints/CreateComplaintPage";
import { ComplaintDetailPage } from "@/pages/complaints/ComplaintDetailPage";
import { AnnouncementsPage } from "@/pages/announcements/AnnouncementsPage";
// import { VisitorsPage } from "@/pages/visitors/VisitorsPage";
// import { PaymentsPage } from "@/pages/payments/PaymentsPage";
import { SocietiesPage } from "@/pages/societies/SocietiesPage";
import { UsersPage } from "@/pages/users/UsersPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { NotificationsPage } from "@/pages/notifications/NotificationsPage";
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";
import { AuditLogsPage } from "@/pages/audit/AuditLogsPage";
import { useAppSelector } from "@/store/hooks";

const HomeRedirect = () => {
  const { user } = useAppSelector((s) => s.auth);
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#151d30',
            color: '#f0f6ff',
            border: '1px solid rgba(0, 198, 255, 0.15)',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0, 114, 255, 0.12)',
          },
          success: {
            iconTheme: { primary: '#00c6ff', secondary: '#151d30' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#151d30' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/complaints/new" element={<CreateComplaintPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            {/* <Route path="/visitors" element={<VisitorsPage />} />
            <Route path="/payments" element={<PaymentsPage />} /> */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
              <Route path="/societies" element={<SocietiesPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["super_admin", "society_admin"]}
                />
              }
            >
              <Route path="/users" element={<UsersPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
