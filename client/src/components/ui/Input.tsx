import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-lg border border-border-subtle bg-surface-input px-3 py-2.5 text-sm text-text-primary shadow-sm transition placeholder:text-text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/25 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/25' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-400">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
