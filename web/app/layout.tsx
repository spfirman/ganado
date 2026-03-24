import type { Metadata } from 'next';
import { Manrope, Noto_Serif } from 'next/font/google';
import './globals.css';
import './components/theme/tokens.css';
import LayoutShell from './components/layout/LayoutShell';
import { AuthProvider } from './lib/auth-context';

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const notoSerif = Noto_Serif({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ganado — Ranch Management',
  description: 'GPCB Ranch Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: 'var(--font-body)',
          background: 'var(--surface)',
          color: 'var(--on-surface)',
        }}
      >
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
