'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';

interface Counts {
  cattle: number;
  purchases: number;
  sales: number;
  events: number;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ cattle: 0, purchases: 0, sales: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos del panel');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const metrics: { label: string; value: string | number; icon: string; variant: 'positive' | 'neutral' | 'alert' }[] = [
    { label: 'Total Ganado', value: loading ? '—' : counts.cattle, icon: '🐄', variant: 'positive' },
    { label: 'Compras Activas', value: loading ? '—' : counts.purchases, icon: '🛒', variant: 'neutral' },
    { label: 'Ventas del Mes', value: loading ? '—' : counts.sales, icon: '💰', variant: 'neutral' },
    { label: 'Eventos Activos', value: loading ? '—' : counts.events, icon: '📋', variant: 'alert' },
  ];

  const quickActions = [
    { label: 'Nuevo Animal', href: '/cattle/new' },
    { label: 'Nueva Compra', href: '/purchases/new' },
    { label: 'Nueva Venta', href: '/sales/new' },
    { label: 'Nuevo Evento', href: '/events/new' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h1 className="font-heading text-3xl font-bold text-on-surface m-0">
        Panel de Control
      </h1>
      <p className="font-body text-on-surface-muted mt-1 mb-8 text-base">
        Resumen de operaciones del rancho
      </p>

      {error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-5 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {metrics.map((m) => (
          <KPICard
            key={m.label}
            title={m.label}
            value={m.value}
            bgVariant={m.variant}
            icon={<span className="text-2xl">{m.icon}</span>}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-heading text-xl font-semibold text-on-surface mb-4">
        Acciones Rápidas
      </h2>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href} className="no-underline">
            <Button variant="primary" size="md">
              + {a.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
