import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquareWarning } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import type { Complaint } from '@/types';
import { COMPLAINT_CATEGORIES } from '@/constants';

export const ComplaintsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  const fetchComplaints = () => {
    setLoading(true);
    // api
    //   .get('/complaints', { params: { search, status, category, limit: 50 } })
    //   .then(({ data }) => setComplaints(data.data || []))
    //   .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, [search, status, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Complaints</h1>
        {user?.role === 'resident' && (
          <Link to="/complaints/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
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
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="font-medium text-primary-600 hover:underline"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 capitalize">{c.category}</td>
                    <td className="py-3 capitalize">{c.priority}</td>
                    <td className="py-3">
                      <Badge status={c.status} />
                    </td>
                    <td className="py-3 text-gray-500">
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
