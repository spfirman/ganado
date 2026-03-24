import type { Metadata } from 'next';
import { Manrope, Noto_Serif } from 'next/font/google';
import './globals.css';
import LayoutShell from './components/layout/LayoutShell';
import { AuthProvider } from './lib/auth-context';
import { ThemeProvider } from './lib/theme-context';

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('ganado-theme')||'pasturePrime';if(t==='system')t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)})()` }} />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-on-background font-body"
      >
        <AuthProvider>
          <ThemeProvider>
            <LayoutShell>{children}</LayoutShell>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
