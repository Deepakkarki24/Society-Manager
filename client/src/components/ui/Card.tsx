import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export const Card = ({
  children,
  className = "",
  title,
  action,
}: CardProps) => (
  <div
    className={`rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm shadow-black/20 ${className}`}
  >
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && (
          <h3 className="text-lg font-semibold text-text-primary">
            {title}
          </h3>
        )}
        {action}
      </div>
    )}
    {children}
  </div>
);
