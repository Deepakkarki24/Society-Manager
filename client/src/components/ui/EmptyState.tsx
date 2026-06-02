import type { LucideIcon } from 'lucide-react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Icon className="mb-4 h-12 w-12 text-gray-400" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
