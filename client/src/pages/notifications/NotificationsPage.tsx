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
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
        <Button variant="secondary" onClick={markAllRead}>Mark all read</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card
              key={n._id}
              className={!n.isRead ? 'border-primary-200 dark:border-primary-800' : ''}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium dark:text-white">{n.title}</h3>
                  <p className="text-sm text-gray-500">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && (
                  <Button size="sm" variant="ghost" onClick={() => handleRead(n._id)}>Mark read</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
