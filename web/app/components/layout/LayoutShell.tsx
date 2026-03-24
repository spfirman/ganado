'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppShell from './AppShell';
import { useAuth } from '../../lib/auth-context';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isPublic = isPublicRoute(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.push('/login');
    }
  }, [loading, user, isPublic, router]);

  if (isPublic) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-3 border-border rounded-full border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
