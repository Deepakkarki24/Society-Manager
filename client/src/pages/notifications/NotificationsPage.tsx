import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNotifications, markRead } from '@/store/slices/notificationSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/api-manager/apiInterceptor';

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const markAllRead = async () => {
    await api.patch('/api/notifications/read-all');
    dispatch(fetchNotifications());
  };

  const handleRead = (id: string) => {
    api.patch(`/api/notifications/${id}/read`);
    dispatch(markRead(id));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
        <Button variant="secondary" onClick={markAllRead}>Mark all read</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card
              key={n._id}
              className={!n.isRead ? 'border-primary-400/30 ring-1 bg-linear-to-br from-[#00c8ff75]  to-[#0073ff66] ring-primary-400/20' : ''}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">{n.title}</h3>
                  <p className={`text-sm ${n.isRead ? "text-text-muted" : "text-text-primary"}`}>{n.message}</p>
                  <p className={`mt-1 text-xs ${n.isRead ? "text-text-muted" : "text-text-primary"}`}>{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && (
                  <Button size="sm" className='text-white' variant="ghost" onClick={() => handleRead(n._id)}>Mark read</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
