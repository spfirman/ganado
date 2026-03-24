'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-dark shadow-sm hover:shadow-md',
  secondary:
    'bg-secondary text-on-secondary hover:opacity-90 shadow-sm',
  ghost:
    'bg-transparent text-primary border border-border hover:bg-surface',
  danger:
    'bg-error text-white hover:opacity-90 shadow-sm',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-sm',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-150 cursor-pointer whitespace-nowrap
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
