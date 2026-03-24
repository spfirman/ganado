'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={styles.topBar}>
      {/* Left: Brand */}
      <div style={styles.left}>
        <span style={styles.brandText}>ganado</span>
      </div>

      {/* Center: Quick links */}
      <nav style={styles.center}>
        <Link href="/dashboard" style={styles.quickLink}>Panel</Link>
        <Link href="/cattle" style={styles.quickLink}>Ganado</Link>
        <Link href="/events" style={styles.quickLink}>Eventos</Link>
      </nav>

      {/* Right: Actions */}
      <div style={styles.right}>
        {/* Search */}
        <button style={styles.iconButton} title="Buscar" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Notifications */}
        <button style={styles.iconButton} title="Notificaciones" aria-label="Notificaciones">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span style={styles.notifBadge} />
        </button>

        {/* User menu */}
        <div ref={dropdownRef} style={styles.userMenuWrapper}>
          <button
            style={styles.userButton}
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Menu de usuario"
          >
            <div style={styles.avatar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>Admin</span>
              <span style={styles.userRole}>Administrador</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div style={styles.dropdown}>
              <Link href="/profile" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Perfil
              </Link>
              <Link href="/settings" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Configuraci&oacute;n
              </Link>
              <div style={styles.dropdownDivider} />
              <button style={styles.dropdownItemDanger}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesi&oacute;n
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topBar: {
    position: 'sticky',
    top: 0,
    height: 56,
    background: 'var(--surface-container-lowest)',
    borderBottom: '1px solid var(--outline-variant)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 30,
    fontFamily: 'var(--font-body)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  brandText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--primary)',
    letterSpacing: '-0.02em',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  quickLink: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--on-surface-variant)',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: 6,
    transition: 'background 150ms, color 150ms',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    color: 'var(--on-surface-variant)',
    cursor: 'pointer',
    transition: 'background 150ms',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#D32F2F',
    border: '2px solid var(--surface-container-lowest)',
  },
  userMenuWrapper: {
    position: 'relative',
    marginLeft: 4,
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 8,
    color: 'var(--on-surface)',
    transition: 'background 150ms',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: 1.3,
  },
  userName: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
  },
  userRole: {
    fontSize: '0.6875rem',
    color: 'var(--on-surface-variant)',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    minWidth: 200,
    background: 'var(--surface-container-lowest)',
    border: '1px solid var(--outline-variant)',
    borderRadius: 10,
    boxShadow: '0 8px 32px rgba(26,26,46,0.12)',
    padding: '6px',
    zIndex: 50,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--on-surface)',
    textDecoration: 'none',
    borderRadius: 6,
    transition: 'background 150ms',
    cursor: 'pointer',
  },
  dropdownDivider: {
    height: 1,
    background: 'var(--outline-variant)',
    margin: '4px 0',
  },
  dropdownItemDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: '#D32F2F',
    background: 'transparent',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 150ms',
    fontFamily: 'var(--font-body)',
  },
};
