import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import api from '@/api-manager/apiInterceptor';

interface AuditLog {
  _id: string;
  action: string;
  entity: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.get('/api/audit-logs').then(({ data }) => setLogs(data.data || []));
  }, []);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Audit Logs</h1>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-3 text-left">User</th>
              <th className="pb-3 text-left">Action</th>
              <th className="pb-3 text-left">Entity</th>
              <th className="pb-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-border-subtle transition hover:bg-surface-hover">
                <td className="py-3">{log.user?.name || '-'}</td>
                <td className="py-3 capitalize">{log.action}</td>
                <td className="py-3">{log.entity}</td>
                <td className="py-3 text-text-muted">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
