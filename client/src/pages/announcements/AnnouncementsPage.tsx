import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector } from '@/store/hooks';
import type { Announcement } from '@/types';
import toast from 'react-hot-toast';
import { Megaphone } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/api-manager/apiInterceptor';

export const AnnouncementsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [items, setItems] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    api.get('/api/announcements').then(({ data }) => setItems(data.data || []));
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (data: Record<string, unknown>) => {
    await api.post('/api/announcements', data);
    toast.success('Announcement created');
    setModalOpen(false);
    reset();
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Announcements</h1>
        {user?.role === 'society_admin' && (
          <Button onClick={() => setModalOpen(true)}>Create Announcement</Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((a) => (
            <Card key={a._id}>
              <div className="mb-2 flex gap-2">
                {a.isImportant && <Badge status="pending" label="Important" />}
                {a.isEvent && <Badge status="assigned" label="Event" />}
              </div>
              <h3 className="font-semibold dark:text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{a.content}</p>
              <p className="mt-3 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input label="Title" {...register('title', { required: true })} />
          <Textarea label="Content" {...register('content', { required: true })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isImportant')} /> Important notice
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isEvent')} /> Event notification
          </label>
          <Button type="submit" className="w-full">Publish</Button>
        </form>
      </Modal>
    </div>
  );
};
