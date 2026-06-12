import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import type { User } from '@/types';
import toast from 'react-hot-toast';
import api from '@/api-manager/apiInterceptor';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => api.get('/api/users').then(({ data }) => setUsers(data.data.data || []));
  useEffect(() => { load(); }, []);

  const onCreate = async (data: Record<string, string>) => {
    await api.post('/api/users', data);
    toast.success('User created');
    setModalOpen(false);
    reset();
    load();
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <Button onClick={() => setModalOpen(true)}>Add User</Button>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-3 text-left">Name</th>
              <th className="pb-3 text-left">Email</th>
              <th className="pb-3 text-left">Role</th>
              <th className="pb-3 text-left">Flat</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-border-subtle transition hover:bg-surface-hover">
                <td className="py-3">{u.name}</td>
                <td className="py-3">{u.email}</td>
                <td className="py-3"><Badge status="assigned" label={u.role.replace('_', ' ')} /></td>
                <td className="py-3">{u.flatNumber || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add User">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="Email" type="email" {...register('email', { required: true })} />
          <Input label="Password" type="password" {...register('password', { required: true })} />
          <Select
            label="Role"
            options={[
              { value: 'resident', label: 'Resident' },
              { value: 'society_admin', label: 'Society Admin' },
              { value: 'maintenance_staff', label: 'Maintenance Staff' },
            ]}
            {...register('role', { required: true })}
          />
          <Input label="Flat Number" {...register('flatNumber')} />
          <Input label="Block" {...register('block')} />
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </Modal>
    </div>
  );
};
