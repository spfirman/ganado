'use client';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'neutral';
  className?: string;
}

const variantClasses: Record<string, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  pending: 'bg-warning/10 text-on-surface-muted',
  neutral: 'bg-surface text-on-surface-muted',
};

export default function Badge({
  label,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {label}
    </span>
  );
}
