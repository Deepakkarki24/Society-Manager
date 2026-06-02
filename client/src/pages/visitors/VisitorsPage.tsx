import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector } from '@/store/hooks';
import type { Visitor } from '@/types';
import toast from 'react-hot-toast';

export const VisitorsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => api.get('/visitors').then(({ data }) => setVisitors(data.data || []));
  useEffect(() => { load(); }, []);

  const onPreApprove = async (data: Record<string, string>) => {
    await api.post('/visitors', data);
    toast.success('Visitor pre-approved');
    setModalOpen(false);
    reset();
    load();
  };

  const checkIn = async (id: string) => {
    await api.patch(`/visitors/${id}/check-in`);
    toast.success('Checked in');
    load();
  };

  const checkOut = async (id: string) => {
    await api.patch(`/visitors/${id}/check-out`);
    toast.success('Checked out');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Visitors</h1>
        {user?.role === 'resident' && (
          <Button onClick={() => setModalOpen(true)}>Pre-approve Visitor</Button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="pb-3 text-left">Name</th>
                <th className="pb-3 text-left">Phone</th>
                <th className="pb-3 text-left">Purpose</th>
                <th className="pb-3 text-left">Flat</th>
                <th className="pb-3 text-left">Status</th>
                {user?.role === 'society_admin' && <th className="pb-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v._id} className="border-b dark:border-gray-800">
                  <td className="py-3">{v.name}</td>
                  <td className="py-3">{v.phone}</td>
                  <td className="py-3">{v.purpose}</td>
                  <td className="py-3">{v.flatNumber}</td>
                  <td className="py-3"><Badge status={v.status} /></td>
                  {user?.role === 'society_admin' && (
                    <td className="py-3 flex gap-2">
                      {v.status === 'pre_approved' && (
                        <Button size="sm" onClick={() => checkIn(v._id)}>Check In</Button>
                      )}
                      {v.status === 'checked_in' && (
                        <Button size="sm" variant="secondary" onClick={() => checkOut(v._id)}>Check Out</Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pre-approve Visitor">
        <form onSubmit={handleSubmit(onPreApprove)} className="space-y-4">
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="Phone" {...register('phone', { required: true })} />
          <Input label="Purpose" {...register('purpose', { required: true })} />
          <Input label="Vehicle Number" {...register('vehicleNumber')} />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Modal>
    </div>
  );
};
