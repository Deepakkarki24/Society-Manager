import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAppSelector } from '@/store/hooks';
import type { DashboardAnalytics } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { MessageSquareWarning, CheckCircle, Clock, Users } from 'lucide-react';
import { getDashboardAnalytics, getPlatformAnalytics } from '@/api-manager/requestHandler';

export const AnalyticsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [platform, setPlatform] = useState<{
    societiesByCity: { _id: string; count: number }[];
    complaintsBySociety: { societyName: string; total: number; resolved: number }[];
  } | null>(null);
  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const getPlatformAnalyticsData = async () => {
    try {
      const res = await getPlatformAnalytics()
      const { data } = res.data as any
      setPlatform(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  const getDashboardAnalyticsData = async () => {
    try {
      const res = await getDashboardAnalytics()
      const { data } = res.data as any
      setDashboard(data)
      console.log(res)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }


  useEffect(() => {
    user?.role === 'super_admin' ? getPlatformAnalyticsData() : getDashboardAnalyticsData()
  }, [user?.role]);

  if (loading) return <CardSkeleton />;

  if (user?.role !== 'super_admin' && dashboard) {
    return (
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold dark:text-white">Society Analytics</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Complaints" value={dashboard.complaints.total} icon={MessageSquareWarning} color="blue" />
          <StatCard title="Resolved" value={dashboard.complaints.resolved} icon={CheckCircle} color="green" />
          <StatCard title="Pending" value={dashboard.complaints.pending} icon={Clock} color="yellow" />
          <StatCard title="Residents" value={dashboard.residents.total} icon={Users} color="purple" />
        </div>
      </div>
    );
  }

  if (!platform) return <CardSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold dark:text-white">Platform Analytics</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Societies by City">
          <ul className="space-y-2">
            {platform.societiesByCity?.map((c) => (
              <li key={c._id} className="flex justify-between text-sm">
                <span>{c._id}</span>
                <span className="font-medium">{c.count}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Top Societies by Complaints">
          <ul className="space-y-2">
            {platform.complaintsBySociety?.map((s, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{s.societyName}</span>
                <span>{s.resolved}/{s.total} resolved</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
