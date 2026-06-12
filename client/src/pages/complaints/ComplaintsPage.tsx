import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquareWarning } from 'lucide-react';
import type { Complaint } from '@/types';
import { COMPLAINT_CATEGORIES } from '@/constants';
import api from '@/api-manager/apiInterceptor';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  const fetchComplaints = () => {
    setLoading(true);
    api
      .get('/api/complaints', { params: { search, status, category, limit: 50 } })
      .then(({ data }) => setComplaints(data.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, [search, status, category]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Complaints</h1>
      </div>

      <Card>
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'reopened', label: 'Reopened' },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Select
            options={[{ value: '', label: 'All categories' }, ...COMPLAINT_CATEGORIES]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {loading ? (
          <TableSkeleton />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={MessageSquareWarning}
            title="No complaints"
            description="Complaints will appear here"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="pb-3 pl-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints && complaints.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-border-subtle transition hover:bg-surface-hover"
                  >
                    <td className="py-3 pl-3">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="font-medium text-primary-400 hover:text-primary-300 hover:underline"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 capitalize">{c.category}</td>
                    <td className="py-3 capitalize">{c.priority}</td>
                    <td className="py-3">
                      <Badge status={c.status} />
                    </td>
                    <td className="py-3 text-text-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
