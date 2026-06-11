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
      <h1 className="text-2xl font-bold dark:text-white">Audit Logs</h1>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="pb-3 text-left">User</th>
              <th className="pb-3 text-left">Action</th>
              <th className="pb-3 text-left">Entity</th>
              <th className="pb-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b dark:border-gray-800">
                <td className="py-3">{log.user?.name || '-'}</td>
                <td className="py-3 capitalize">{log.action}</td>
                <td className="py-3">{log.entity}</td>
                <td className="py-3 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
