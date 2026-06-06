import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Society } from '@/types';
import toast from 'react-hot-toast';
import api from '@/api-manager/apiInterceptor';

export const SocietiesPage = () => {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => api.get('/api/societies').then(({ data }) => setSocieties(data.data || []));
  useEffect(() => { load(); }, []);

  const onCreate = async (data: Record<string, unknown>) => {
    await api.post('/api/societies', { ...data, totalFlats: Number(data.totalFlats), maintenanceAmount: Number(data.maintenanceAmount || 0) });
    toast.success('Society created');
    setModalOpen(false);
    reset();
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Societies</h1>
        <Button onClick={() => setModalOpen(true)}>Add Society</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {societies.map((s) => (
          <Card key={s._id}>
            <h3 className="font-semibold dark:text-white">{s.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.city}, {s.state}</p>
            <p className="text-sm text-gray-500">{s.totalFlats} flats · ₹{s.maintenanceAmount}/mo</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Society" size="lg">
        <form onSubmit={handleSubmit(onCreate)} className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="City" {...register('city', { required: true })} />
          <Input label="Address" className="sm:col-span-2" {...register('address', { required: true })} />
          <Input label="State" {...register('state', { required: true })} />
          <Input label="Pincode" {...register('pincode', { required: true })} />
          <Input label="Total Flats" type="number" {...register('totalFlats', { required: true })} />
          <Input label="Maintenance Amount" type="number" {...register('maintenanceAmount')} />
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
