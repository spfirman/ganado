'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.shell}>
      <Sidebar />
      <div style={styles.main}>
        <TopBar />
        <main style={styles.content}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--surface)',
  },
  main: {
    marginLeft: 256,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    padding: '24px 32px',
  },
};
