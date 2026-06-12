import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const colors = {
  blue: "bg-primary-400/15 text-primary-400 ring-1 ring-primary-400/25",
  green: "bg-green-500/15 text-green-400 ring-1 ring-green-500/25",
  yellow: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/25",
  red: "bg-red-500/15 text-red-400 ring-1 ring-red-500/25",
  purple: "bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/25",
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatCardProps) => (
  <div className="rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm shadow-black/20 transition hover:border-primary-400/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="mt-1 text-2xl font-bold text-text-primary">
          {value}
        </p>
        {trend && <p className="mt-1 text-xs text-text-muted">{trend}</p>}
      </div>
      <div className={`rounded-xl p-3 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);
