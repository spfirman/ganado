'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Sale {
  id: number | string;
  transactionDate?: string;
  saleDate?: string;
  buyer?: { name: string };
  buyerName?: string;
  totalAnimalCount?: number;
  totalAnimals?: number;
  totalWeightKg?: number;
  totalWeight?: number;
  totalAmount?: number;
  totalPrice?: number;
  status?: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<Sale[] | { data?: Sale[]; items?: Sale[] }>('/sales');
        setSales(Array.isArray(res) ? res : res.items ?? res.data ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar ventas');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    { key: 'transactionDate', label: 'Fecha', render: (s: Sale) => { const d = s.transactionDate || s.saleDate; return d ? new Date(d).toLocaleDateString('es-CO') : '—'; } },
    { key: 'buyer', label: 'Comprador', render: (s: Sale) => s.buyer?.name || s.buyerName || '—' },
    { key: 'totalAnimalCount', label: '# Animales', render: (s: Sale) => s.totalAnimalCount ?? s.totalAnimals ?? '—' },
    { key: 'totalWeightKg', label: 'Peso Total', render: (s: Sale) => { const w = s.totalWeightKg ?? s.totalWeight; return w != null ? `${Number(w).toLocaleString()} kg` : '—'; } },
    { key: 'totalAmount', label: 'Precio Total', render: (s: Sale) => { const p = s.totalAmount ?? s.totalPrice; return p != null ? `COP $${Number(p).toLocaleString()}` : '—'; } },
    { key: 'status', label: 'Estado', render: (s: Sale) => <Badge label={s.status || 'activa'} variant={s.status === 'completed' ? 'success' : 'warning'} /> },
    { key: '_actions', label: 'Acciones', render: (s: Sale) => (
      <Link href={`/sales/${s.id}`} className="text-primary font-semibold no-underline hover:underline text-sm">Ver</Link>
    )},
  ];

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Ventas</h1>
        <Link href="/sales/new" className="no-underline">
          <Button>+ Nueva Venta</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <DataTable columns={columns} data={sales} loading={loading} emptyMessage="No hay ventas registradas" />
    </div>
  );
}
