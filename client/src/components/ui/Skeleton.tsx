export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-surface-hover ${className}`} />
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-border-subtle p-6">
    <Skeleton className="mb-4 h-6 w-1/3" />
    <Skeleton className="mb-2 h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
