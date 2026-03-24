'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile by default, shown as overlay when toggled */}
      <div className={`
        fixed top-0 left-0 bottom-0 z-50
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `.trim()}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
