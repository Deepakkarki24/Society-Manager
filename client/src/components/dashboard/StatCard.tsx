import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const colors = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  yellow:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && <p className="mt-1 text-xs text-gray-500">{trend}</p>}
      </div>
      <div className={`rounded-lg p-3 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);
