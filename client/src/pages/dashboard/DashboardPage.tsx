import { useEffect, useState } from 'react';
import {
  MessageSquareWarning,
  CheckCircle,
  Clock,
  Users,
  Building2,
} from 'lucide-react';
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
} from 'recharts';
import api from '@/services/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAppSelector } from '@/store/hooks';
import type { DashboardAnalytics } from '@/types';
import { MONTHS } from '@/constants';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export const DashboardPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/analytics/dashboard')
      .then(({ data }) => setAnalytics(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500">Here&apos;s what&apos;s happening in your society</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        {user?.role === 'super_admin' ? (
          <StatCard
            title="Societies"
            value={analytics?.societies.total ?? 0}
            icon={Building2}
            color="purple"
          />
        ) : (
          <StatCard
            title="Residents"
            value={analytics?.residents.total ?? 0}
            icon={Users}
            color="purple"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Monthly Complaint Trends">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="complaints" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
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
    </div>
  );
};
