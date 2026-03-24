'use client';

import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: string;
  bgVariant?: 'positive' | 'neutral' | 'alert';
  icon?: ReactNode;
  className?: string;
}

const bgClasses: Record<string, string> = {
  positive: 'bg-kpi-positive',
  neutral: 'bg-kpi-neutral',
  alert: 'bg-kpi-alert',
};

export default function KPICard({
  title,
  value,
  delta,
  bgVariant = 'neutral',
  icon,
  className = '',
}: KPICardProps) {
  return (
    <div
      className={`
        rounded-lg border border-border-light p-5 ${bgClasses[bgVariant]}
        ${className}
      `.trim()}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-on-surface">
            {value}
          </p>
          {delta && (
            <p className="mt-1 text-xs font-medium text-on-surface-muted">
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-primary opacity-60">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
