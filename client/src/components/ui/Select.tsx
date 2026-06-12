import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full rounded-lg border border-border-subtle bg-surface-input px-3 py-2.5 text-sm text-text-primary transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/25 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option className="bg-surface-card text-text-primary" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);

Select.displayName = 'Select';
