'use client';

import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  options,
  placeholder,
  error,
  id,
  className = '',
  required,
  disabled,
  ...rest
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-md border
          bg-surface text-on-surface
          outline-none transition-all duration-150
          focus:border-primary focus:ring-2 focus:ring-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error ring-1 ring-error/20' : 'border-border'}
        `.trim()}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-error mt-0.5">{error}</span>
      )}
    </div>
  );
}
