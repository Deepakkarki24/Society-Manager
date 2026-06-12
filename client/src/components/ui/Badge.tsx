const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/25',
  assigned: 'bg-primary-400/15 text-primary-300 ring-1 ring-primary-400/25',
  in_progress: 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/25',
  resolved: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/25',
  reopened: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/25',
  paid: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/25',
  overdue: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/25',
};

export const Badge = ({ status, label }: { status: string; label?: string }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[status] || 'bg-surface-hover text-text-secondary ring-1 ring-border-subtle'}`}
  >
    {label || status.replace('_', ' ')}
  </span>
);
