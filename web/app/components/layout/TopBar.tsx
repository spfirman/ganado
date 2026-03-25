'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';

export default function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';
  const handleThemeToggle = () => {
    setTheme(isDark ? 'pasturePrime' : 'dark');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/login');
  };

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
    <header className="sticky top-0 z-30 flex items-center justify-between bg-surface-alt border-b border-border font-body" style={{ height: 56, padding: '0 24px' }}>
      {/* Left: Hamburger (mobile) + Brand */}
      <div className="flex items-center gap-2">
        {onMenuToggle && (
          <button
            className="w-9 h-9 flex items-center justify-center border-none bg-transparent rounded-lg text-on-surface-muted cursor-pointer transition-colors duration-150 hover:bg-surface md:hidden"
            onClick={onMenuToggle}
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <span className="font-heading text-primary font-bold" style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}>ganado</span>
      </div>

      {/* Center: Quick links (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-1">
        <Link href="/dashboard" className="text-on-surface-muted text-[0.8125rem] font-medium no-underline px-3.5 py-1.5 rounded-md transition-all duration-150 hover:bg-surface">Panel</Link>
        <Link href="/cattle" className="text-on-surface-muted text-[0.8125rem] font-medium no-underline px-3.5 py-1.5 rounded-md transition-all duration-150 hover:bg-surface">Ganado</Link>
        <Link href="/events" className="text-on-surface-muted text-[0.8125rem] font-medium no-underline px-3.5 py-1.5 rounded-md transition-all duration-150 hover:bg-surface">Eventos</Link>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="w-9 h-9 flex items-center justify-center border-none bg-transparent rounded-lg text-on-surface-muted cursor-pointer transition-colors duration-150 hover:bg-surface relative" title="Buscar" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Theme toggle */}
        <button
          className="w-9 h-9 flex items-center justify-center border-none bg-transparent rounded-lg text-on-surface-muted cursor-pointer transition-colors duration-150 hover:bg-surface relative"
          title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          onClick={handleThemeToggle}
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 flex items-center justify-center border-none bg-transparent rounded-lg text-on-surface-muted cursor-pointer transition-colors duration-150 hover:bg-surface relative" title="Notificaciones" aria-label="Notificaciones">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute bg-error rounded-full" style={{ top: 6, right: 6, width: 8, height: 8, border: '2px solid var(--color-surface-alt)' }} />
        </button>

        {/* User menu */}
        <div ref={dropdownRef} className="relative ml-1">
          <button
            className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer px-2 py-1 rounded-lg text-on-surface transition-colors duration-150 hover:bg-surface"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Menu de usuario"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex flex-col items-start" style={{ lineHeight: 1.3 }}>
              <span className="text-[0.8125rem] font-semibold text-on-surface">{user ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.username : 'Usuario'}</span>
              <span className="text-[0.6875rem] text-on-surface-muted">{
                ({ SYS_ADMIN: 'Administrador', MANAGER: 'Gerente', ACCOUNTANT: 'Contador', FARM_WORKER: 'Operario' } as Record<string, string>)[user?.role ?? ''] ?? user?.role ?? 'Usuario'
              }</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 bg-surface-alt border border-border-light rounded-lg shadow-lg z-50 p-1.5" style={{ minWidth: 200 }}>
              <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2.5 text-[0.8125rem] font-medium text-on-surface no-underline rounded-md transition-colors duration-150 hover:bg-surface cursor-pointer" onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Perfil
              </Link>
              <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2.5 text-[0.8125rem] font-medium text-on-surface no-underline rounded-md transition-colors duration-150 hover:bg-surface cursor-pointer" onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Configuraci&oacute;n
              </Link>
              <div className="h-px bg-border-light my-1" />
              <button className="flex items-center gap-2.5 px-3 py-2.5 text-[0.8125rem] font-medium text-error bg-transparent border-none rounded-md cursor-pointer w-full transition-colors duration-150 hover:bg-surface font-body" onClick={handleLogout}>
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
