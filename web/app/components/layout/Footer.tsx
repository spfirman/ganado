'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <span style={styles.copyright}>
        &copy; 2026 GANADO &mdash; GPCB RANCH MANAGEMENT
      </span>
      <div style={styles.links}>
        <Link href="/privacy" style={styles.link}>PRIVACIDAD</Link>
        <span style={styles.separator}>|</span>
        <Link href="/terms" style={styles.link}>T&Eacute;RMINOS</Link>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderTop: '1px solid var(--outline-variant)',
    background: 'var(--surface-container-lowest)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.6875rem',
    color: 'var(--on-surface-variant)',
    flexShrink: 0,
  },
  copyright: {
    letterSpacing: '0.04em',
    fontWeight: 500,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    color: 'var(--on-surface-variant)',
    textDecoration: 'none',
    fontWeight: 600,
    letterSpacing: '0.06em',
    transition: 'color 150ms',
  },
  separator: {
    color: 'var(--outline-variant)',
  },
};
