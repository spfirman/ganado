'use client';

import Link from 'next/link';
import CattleForm from '../../components/CattleForm';

export default function NewCattlePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Link href="/cattle" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.875rem', fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}>
        ← Volver a Ganado
      </Link>
      <h1 style={{
        fontFamily: "'Noto Serif', serif",
        fontSize: '1.75rem',
        fontWeight: 700,
        margin: '1rem 0 1.5rem',
        color: 'var(--foreground)',
      }}>
        Nuevo Animal
      </h1>
      <div style={{
        background: 'var(--background, #fff)',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <CattleForm />
      </div>
    </div>
  );
}
