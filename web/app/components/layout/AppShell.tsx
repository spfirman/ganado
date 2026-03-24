'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 256 }}>
        <TopBar />
        <main className="flex-1 px-8 py-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
