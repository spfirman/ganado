'use client';

import type { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = '',
  required,
  disabled,
  ...rest
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-md border
          bg-surface text-on-surface placeholder:text-on-surface-muted/60
          outline-none transition-all duration-150
          focus:border-primary focus:ring-2 focus:ring-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error ring-1 ring-error/20' : 'border-border'}
        `.trim()}
        {...rest}
      />
      {error && (
        <span className="text-xs text-error mt-0.5">{error}</span>
      )}
    </div>
  );
}
