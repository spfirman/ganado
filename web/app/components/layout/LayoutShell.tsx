'use client';

import { usePathname } from 'next/navigation';
import AppShell from './AppShell';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = isPublicRoute(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
