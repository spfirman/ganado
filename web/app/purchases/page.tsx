'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Purchase {
  id: number | string;
  purchaseDate: string;
  providerName?: string;
  provider?: { name: string };
  totalAnimals?: number;
  totalCattle?: number;
  totalWeight?: number;
  totalPrice?: number;
  status?: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<Purchase[] | { data?: Purchase[]; items?: Purchase[] }>('/purchases');
        setPurchases(Array.isArray(res) ? res : res.items ?? res.data ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar compras');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    { key: 'purchaseDate', label: 'Fecha', render: (p: Purchase) => p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString('es-CO') : '—' },
    { key: 'providerName', label: 'Proveedor', render: (p: Purchase) => p.providerName || p.provider?.name || '—' },
    { key: 'totalAnimals', label: '# Animales', render: (p: Purchase) => p.totalCattle ?? p.totalAnimals ?? '—' },
    { key: 'totalWeight', label: 'Peso Total', render: (p: Purchase) => p.totalWeight != null ? `${p.totalWeight} kg` : '—' },
    { key: 'totalPrice', label: 'Precio Total', render: (p: Purchase) => p.totalPrice != null ? `COP $${p.totalPrice.toLocaleString()}` : '—' },
    { key: 'status', label: 'Estado', render: (p: Purchase) => <Badge label={p.status || 'pendiente'} variant={p.status === 'completed' ? 'success' : 'warning'} /> },
    { key: '_actions', label: 'Acciones', render: (p: Purchase) => (
      <Link href={`/purchases/${p.id}`} className="text-primary font-semibold no-underline hover:underline text-sm">Ver</Link>
    )},
  ];

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Compras</h1>
        <Link href="/purchases/new" className="no-underline">
          <Button>+ Nueva Compra</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <DataTable columns={columns} data={purchases} loading={loading} emptyMessage="No hay compras registradas" />
    </div>
  );
}
