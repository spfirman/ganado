'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Provider {
  id: number;
  name: string;
  nit?: string;
  type?: string;
}

function typeBadgeVariant(type?: string): 'success' | 'info' | 'warning' | 'neutral' {
  switch (type) {
    case 'PROVIDER': return 'success';
    case 'BUYER': return 'info';
    case 'TRANSPORTER': return 'warning';
    case 'VET': return 'info';
    default: return 'neutral';
  }
}

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

  const columns = [
    { key: 'name', label: 'Nombre', render: (p: Provider) => <span className="font-semibold">{p.name}</span> },
    { key: 'nit', label: 'NIT', render: (p: Provider) => p.nit || '—' },
    { key: 'type', label: 'Tipo', render: (p: Provider) => <Badge label={p.type || '—'} variant={typeBadgeVariant(p.type)} /> },
    { key: '_actions', label: 'Acciones', render: (p: Provider) => (
      <Link href={`/providers/${p.id}/edit`} className="text-primary font-semibold no-underline hover:underline text-sm">Editar</Link>
    )},
  ];

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Proveedores</h1>
        <Link href="/providers/new" className="no-underline">
          <Button>+ Nuevo Proveedor</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <DataTable columns={columns} data={providers} loading={loading} emptyMessage="No hay proveedores registrados" />
    </div>
  );
}
