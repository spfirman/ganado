'use client';

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`
        bg-surface-alt rounded-lg shadow-sm border border-border-light
        ${paddingClasses[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
