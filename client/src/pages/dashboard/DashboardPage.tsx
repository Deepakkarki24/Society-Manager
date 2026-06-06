import { useEffect, useState } from "react";
import {
  MessageSquareWarning,
  CheckCircle,
  Clock,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useAppSelector } from "@/store/hooks";
import type { DashboardAnalytics } from "@/types";
import { MONTHS } from "@/constants";
import ChatInput from "@/components/chatInput/ChatInput";
import { getDashboardAnalytics } from "@/api-manager/requestHandler";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export const DashboardPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const getDashboardAnalyticsData = async () => {
    try {
      const res = await getDashboardAnalytics()
      const { data } = res.data as any;
      setAnalytics(data)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getDashboardAnalyticsData()
  }, []);

  if (
    loading &&
    (user?.role === "society_admin" || user?.role === "super_admin")
  ) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const chartData =
    analytics?.monthlyTrends?.map((t) => ({
      name: `${MONTHS[t._id.month - 1]} ${t._id.year}`,
      complaints: t.count,
      resolved: t.resolved,
    })) || [];

  const categoryData =
    analytics?.categoryStats?.map((c) => ({
      name: c._id,
      value: c.count,
    })) || [];

  return (
    <>
      {user?.role === "society_admin" || user?.role === "super_admin" ? (
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500">What&apos;s happening in your society</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 w-full min-h-[80dvh] h-full">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl tracking-wide font-semibold text-gray-900 dark:text-white">
              Welcome, {user?.name.split(" ")[0]}!
            </h1>
            <p className="dark:text-white/50 text-lg">
              What&apos;s happening in your society?
            </p>
          </div>

          <ChatInput />
        </div>
      )}

      {(user?.role === "super_admin" || user?.role === "society_admin") && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4">
          <StatCard
            title="Total Complaints"
            value={analytics?.complaints.total ?? 0}
            icon={MessageSquareWarning}
            color="blue"
          />
          <StatCard
            title="Resolved"
            value={analytics?.complaints.resolved ?? 0}
            icon={CheckCircle}
            color="green"
            trend={`${analytics?.complaints.resolutionRate ?? 0}% resolution rate`}
          />
          <StatCard
            title="Pending"
            value={analytics?.complaints.pending ?? 0}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Societies"
            value={analytics?.societies.total ?? 0}
            icon={Building2}
            color="purple"
          />
        </div>
      )}

      {(user?.role === "super_admin" || user?.role === "society_admin") && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Monthly Complaint Trends">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="complaints"
                  fill="#3b82f6"
                  name="Total"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="resolved"
                  fill="#10b981"
                  name="Resolved"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Complaints by Category">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-gray-500">No data yet</p>
            )}
          </Card>
        </div>
      )}
    </>
  );
};
