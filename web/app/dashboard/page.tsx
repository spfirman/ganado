'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';

interface Counts {
  cattle: number;
  purchases: number;
  sales: number;
  events: number;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ cattle: 0, purchases: 0, sales: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cattleRes, purchasesRes, salesRes, eventsRes] = await Promise.allSettled([
          apiFetch<{ total?: number; count?: number; data?: unknown[] }>('/cattle?limit=1'),
          apiFetch<{ total?: number; count?: number; data?: unknown[] }>('/purchases?limit=1'),
          apiFetch<{ total?: number; count?: number; data?: unknown[] }>('/sales?limit=1'),
          apiFetch<{ total?: number; count?: number; data?: unknown[] }>('/massive-events?limit=1'),
        ]);

        const extractCount = (r: PromiseSettledResult<{ total?: number; count?: number; data?: unknown[] }>) => {
          if (r.status === 'fulfilled') {
            const v = r.value;
            return v.total ?? v.count ?? (Array.isArray(v.data) ? v.data.length : (Array.isArray(v) ? (v as unknown[]).length : 0));
          }
          return 0;
        };

        setCounts({
          cattle: extractCount(cattleRes),
          purchases: extractCount(purchasesRes),
          sales: extractCount(salesRes),
          events: extractCount(eventsRes),
        });
      } catch {
        // leave zeros
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const metrics = [
    { label: 'Total Ganado', value: counts.cattle, icon: '🐄' },
    { label: 'Compras Activas', value: counts.purchases, icon: '🛒' },
    { label: 'Ventas del Mes', value: counts.sales, icon: '💰' },
    { label: 'Eventos Activos', value: counts.events, icon: '📋' },
  ];

  const quickActions = [
    { label: 'Nuevo Animal', href: '/cattle/new' },
    { label: 'Nueva Compra', href: '/purchases/new' },
    { label: 'Nueva Venta', href: '/sales/new' },
    { label: 'Nuevo Evento', href: '/events/new' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: "'Noto Serif', serif",
        fontSize: '2rem',
        fontWeight: 700,
        margin: 0,
        color: 'var(--foreground)',
      }}>
        Panel de Control
      </h1>
      <p style={{
        fontFamily: "'Manrope', sans-serif",
        color: '#666',
        marginTop: '0.25rem',
        marginBottom: '2rem',
        fontSize: '1rem',
      }}>
        Resumen de operaciones del rancho
      </p>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            background: 'var(--background, #fff)',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.75rem' }}>{m.icon}</span>
            <span style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '2rem',
              fontWeight: 700,
              color: '#16a34a',
            }}>
              {loading ? '—' : m.value}
            </span>
            <span style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.875rem',
              color: '#6b7280',
            }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{
        fontFamily: "'Noto Serif', serif",
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: 'var(--foreground)',
      }}>
        Acciones Rápidas
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: '#16a34a',
            color: '#fff',
            borderRadius: 8,
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}>
            + {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
