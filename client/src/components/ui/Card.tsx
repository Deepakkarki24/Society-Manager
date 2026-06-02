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
    className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
  >
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {action}
      </div>
    )}
    {children}
  </div>
);
