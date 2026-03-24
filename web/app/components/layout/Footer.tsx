'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-8 py-4 border-t border-border bg-surface-alt font-body text-[0.6875rem] text-on-surface-muted shrink-0">
      <span className="tracking-wide font-medium">
        &copy; 2026 GANADO &mdash; GPCB RANCH MANAGEMENT
      </span>
      <div className="flex items-center gap-2">
        <Link href="/privacy" className="text-on-surface-muted no-underline font-semibold tracking-wider transition-colors duration-150 hover:text-on-surface">PRIVACIDAD</Link>
        <span className="text-border">|</span>
        <Link href="/terms" className="text-on-surface-muted no-underline font-semibold tracking-wider transition-colors duration-150 hover:text-on-surface">T&Eacute;RMINOS</Link>
      </div>
    </footer>
  );
}
