'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Icon components (simple outlined SVGs) ─── */

function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
    </svg>
  );
}

function IconCattle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="7" ry="5" />
      <path d="M5 14v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3" />
      <path d="M7 9c-1.5-1-2.5-3-2-5" />
      <path d="M17 9c1.5-1 2.5-3 2-5" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function IconBrand() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconPurchase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function IconSale() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function IconProvider() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconEvent() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconDevice() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconRole() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/* ─── Types ─── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* ─── Navigation data ─── */

const navSections: NavSection[] = [
  {
    title: 'PRINCIPAL',
    items: [
      { label: 'Panel', href: '/dashboard', icon: <IconDashboard /> },
      { label: 'Ganado', href: '/cattle', icon: <IconCattle /> },
      { label: 'Hierros', href: '/brands', icon: <IconBrand /> },
    ],
  },
  {
    title: 'COMERCIO',
    items: [
      { label: 'Compras', href: '/purchases', icon: <IconPurchase /> },
      { label: 'Ventas', href: '/sales', icon: <IconSale /> },
      { label: 'Proveedores', href: '/providers', icon: <IconProvider /> },
    ],
  },
  {
    title: 'OPERACIONES',
    items: [
      { label: 'Eventos', href: '/events', icon: <IconEvent /> },
      { label: 'Dispositivos', href: '/devices', icon: <IconDevice /> },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Usuarios', href: '/users', icon: <IconUser /> },
      { label: 'Roles', href: '/roles', icon: <IconRole /> },
    ],
  },
];

/* ─── Sidebar component ─── */

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="14" rx="8" ry="6" />
            <path d="M6 8c-2-1.5-3-4-2-6" />
            <path d="M18 8c2-1.5 3-4 2-6" />
          </svg>
        </div>
        <div>
          <div style={styles.brandName}>Ganado</div>
          <div style={styles.brandSub}>RANCH MANAGEMENT</div>
        </div>
      </div>

      {/* Nav sections */}
      <nav style={styles.nav}>
        {navSections.map((section) => (
          <div key={section.title} style={styles.section}>
            <div style={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.navItem,
                    ...(active ? styles.navItemActive : {}),
                  }}
                >
                  {active && <span style={styles.activeBar} />}
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom settings */}
      <div style={styles.bottomSection}>
        <Link
          href="/settings"
          style={{
            ...styles.navItem,
            ...(isActive('/settings') ? styles.navItemActive : {}),
          }}
        >
          {isActive('/settings') && <span style={styles.activeBar} />}
          <span style={styles.navIcon}><IconSettings /></span>
          <span>Configuraci&oacute;n</span>
        </Link>
      </div>
    </aside>
  );
}

/* ─── Inline styles ─── */

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 256,
    background: 'var(--sidebar-bg)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(201,168,76,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#FFFFFF',
    lineHeight: 1.2,
  },
  brandSub: {
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'var(--gold-accent)',
    marginTop: 2,
  },
  nav: {
    flex: 1,
    padding: '12px 0',
    overflowY: 'auto',
  },
  section: {
    marginBottom: 8,
    padding: '0 12px',
  },
  sectionTitle: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.35)',
    padding: '16px 8px 6px',
    fontFamily: 'var(--font-body)',
  },
  navItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '9px 12px',
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    transition: 'background 150ms, color 150ms',
    fontFamily: 'var(--font-body)',
    marginBottom: 2,
  },
  navItemActive: {
    background: 'var(--sidebar-active)',
    color: '#FFFFFF',
    fontWeight: 600,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
    background: 'var(--gold-accent)',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    flexShrink: 0,
    opacity: 0.85,
  },
  bottomSection: {
    padding: '8px 12px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
};
