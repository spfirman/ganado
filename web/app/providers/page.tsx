'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';

interface Provider {
  id: number;
  name: string;
  nit?: string;
  type?: string;
}

const typeBadge: Record<string, { bg: string; color: string }> = {
  PROVIDER: { bg: '#dcfce7', color: '#166534' },
  BUYER: { bg: '#dbeafe', color: '#1e40af' },
  TRANSPORTER: { bg: '#ffedd5', color: '#9a3412' },
  VET: { bg: '#ede9fe', color: '#6b21a8' },
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<Provider[] | { data: Provider[] }>('/providers');
        setProviders(Array.isArray(res) ? res : res.data ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar proveedores');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, margin: 0 }}>Proveedores</h1>
        <Link href="/providers/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.625rem 1.25rem', background: '#16a34a', color: '#fff',
          borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
        }}>
          + Nuevo Proveedor
        </Link>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: 8, marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && providers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          No hay proveedores registrados
        </div>
      )}

      {!loading && providers.length > 0 && (
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Nombre', 'NIT', 'Tipo', 'Acciones'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.map((p, i) => {
                const badge = typeBadge[p.type ?? ''] ?? { bg: '#f3f4f6', color: '#374151' };
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{p.nit || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
                        background: badge.bg, color: badge.color,
                      }}>
                        {p.type || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                      <Link href={`/providers/${p.id}/edit`} style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
