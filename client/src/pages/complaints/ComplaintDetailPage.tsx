import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAppSelector } from '@/store/hooks';
import type { Complaint, User } from '@/types';
import toast from 'react-hot-toast';
import api from '@/api-manager/apiInterceptor';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const { user } = useAppSelector((s) => s.auth);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [staff, setStaff] = useState<User[]>([]);
  const [comment, setComment] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    api.get(`/api/complaints/${id}`).then(({ data }) => setComplaint(data.data.data));
  };

  useEffect(() => {
    load();
    if (user?.role === 'society_admin') {
      api.get('/api/users/staff').then(({ data }) => setStaff(data.data || []));
    }
  }, [id, user?.role]);

  const handleAssign = async () => {
    await api.patch(`/api/complaints/${id}/assign`, { assignedTo: assignTo });
    toast.success('Assigned');
    load();
  };

  const handleStatus = async () => {
    await api.patch(`/api/complaints/${id}/status`, { status });
    toast.success('Status updated');
    load();
  };

  const handleComment = async () => {
    await api.post(`/api/complaints/${id}/comments`, { text: comment });
    setComment('');
    load();
  };

  const handleReopen = async () => {
    await api.post(`/api/complaints/${id}/reopen`);
    toast.success('Complaint reopened');
    load();
  };

  if (!complaint) return <CardSkeleton />;

  const createdBy =
    typeof complaint.createdBy === 'object' ? complaint.createdBy : null;

  return (
    <div className="w-full mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{complaint.title}</h1>
          <div className="mt-2 flex gap-2">
            <Badge status={complaint.status} />
            <span className="text-sm capitalize text-text-muted">{complaint.category}</span>
          </div>
        </div>
        {user?.role === 'resident' && complaint.status === 'resolved' && (
          <Button variant="secondary" onClick={handleReopen}>Reopen</Button>
        )}
      </div>

      <Card title="Details">
        <p className="text-text-secondary">{complaint.description}</p>
        {complaint.image && (
          <div className="mt-4 flex flex-wrap gap-2">
            <img src={complaint.image} alt="" className="h-24 rounded-lg object-cover" />
          </div>
        )}
      </Card>

      {user?.role === 'society_admin' && complaint.status === 'pending' && (
        <Card title="Assign to Staff">
          <div className="flex gap-2">
            <Select
              options={[
                { value: '', label: 'Select staff' },
                ...staff.map((s) => ({ value: s._id, label: s.name })),
              ]}
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
            />
            <Button onClick={handleAssign} disabled={!assignTo}>Assign</Button>
          </div>
        </Card>
      )}

      {(user?.role === 'society_admin' || user?.role === 'maintenance_staff') &&
        ['assigned', 'in_progress'].includes(complaint.status) && (
          <Card title="Update Status">
            <div className="flex gap-2">
              <Select
                options={[
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
              <Button onClick={handleStatus} disabled={!status}>Update</Button>
            </div>
          </Card>
        )}

      <Card title="Comments">
        <div className="mb-4 space-y-3">
          {complaint.comments?.map((c, i) => (
            <div key={i} className="rounded-lg bg-surface-hover p-3 ring-1 ring-border-subtle">
              <p className="text-sm font-medium">{c.user?.name}</p>
              <p className="text-sm">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
          <Button className='w-full' onClick={handleComment}>Send</Button>
        </div>
      </Card>

      {createdBy && (
        <p className="text-sm text-text-muted">
          Raised by {createdBy.name} · Flat {createdBy.flatNumber}
        </p>
      )}
    </div>
  );
};
