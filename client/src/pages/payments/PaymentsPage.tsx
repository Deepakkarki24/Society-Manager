import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector } from '@/store/hooks';
import type { Payment } from '@/types';
import { MONTHS } from '@/constants';
import toast from 'react-hot-toast';
import api from '@/api-manager/apiInterceptor';

export const PaymentsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<{ pending: number; paid: number; totalRevenue: number } | null>(null);

  const load = () => {
    api.get('/payments').then(({ data }) => setPayments(data.data || []));
    if (user?.role === 'society_admin') {
      api.get('/payments/summary').then(({ data }) => setSummary(data.data));
    }
  };

  useEffect(() => { load(); }, [user?.role]);

  const generateInvoices = async () => {
    const now = new Date();
    await api.post('/payments', { month: now.getMonth() + 1, year: now.getFullYear() });
    toast.success('Invoices generated');
    load();
  };

  const pay = async (id: string) => {
    await api.patch(`/payments/${id}/pay`, { paymentMethod: 'online' });
    toast.success('Payment recorded');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Maintenance Payments</h1>
        {user?.role === 'society_admin' && (
          <Button onClick={generateInvoices}>Generate Monthly Invoices</Button>
        )}
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{summary.pending}</p></Card>
          <Card><p className="text-sm text-gray-500">Paid</p><p className="text-2xl font-bold">{summary.paid}</p></Card>
          <Card><p className="text-sm text-gray-500">Revenue</p><p className="text-2xl font-bold">₹{summary.totalRevenue}</p></Card>
        </div>
      )}

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              {user?.role === 'society_admin' && <th className="pb-3 text-left">Resident</th>}
              <th className="pb-3 text-left">Period</th>
              <th className="pb-3 text-left">Amount</th>
              <th className="pb-3 text-left">Due</th>
              <th className="pb-3 text-left">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b dark:border-gray-800">
                {user?.role === 'society_admin' && (
                  <td className="py-3">{typeof p.resident === 'object' ? p.resident?.name : '-'}</td>
                )}
                <td className="py-3">{MONTHS[p.month - 1]} {p.year}</td>
                <td className="py-3">₹{p.amount}</td>
                <td className="py-3">{new Date(p.dueDate).toLocaleDateString()}</td>
                <td className="py-3"><Badge status={p.status} /></td>
                <td className="py-3">
                  {p.status === 'pending' && user?.role === 'resident' && (
                    <Button size="sm" onClick={() => pay(p._id)}>Pay Now</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
