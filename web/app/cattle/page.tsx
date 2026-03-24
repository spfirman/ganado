'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';
import Link from 'next/link';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Cattle {
  id: number | string;
  number?: string;
  receivedWeight?: number;
  lastWeight?: number;
  status?: string;
  color?: string;
  gender?: string;
}

interface CattleResponse {
  data: Cattle[];
  total: number;
  page?: number;
  limit?: number;
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo', sold: 'Vendido', deceased: 'Fallecido',
  ACTIVE: 'Activo', SOLD: 'Vendido', DECEASED: 'Fallecido',
};

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Macho', FEMALE: 'Hembra', male: 'Macho', female: 'Hembra',
};

function statusVariant(status?: string): 'success' | 'warning' | 'error' | 'neutral' {
  const s = status?.toLowerCase();
  if (s === 'active') return 'success';
  if (s === 'sold') return 'warning';
  if (s === 'deceased') return 'error';
  return 'neutral';
}

const PAGE_SIZE = 20;

export default function CattleListPage() {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCattle = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await apiFetch<CattleResponse | Cattle[]>(`/cattle?${params.toString()}`);
      if (Array.isArray(res)) {
        setCattle(res);
        setTotal(res.length);
      } else {
        setCattle(res.data ?? []);
        setTotal(res.total ?? 0);
      }
    } catch {
      setCattle([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchCattle();
  }, [fetchCattle]);

  const columns = [
    { key: '_idx', label: '#', render: (_: Cattle, idx?: number) => <span className="text-on-surface-muted">{(page - 1) * PAGE_SIZE + (idx ?? 0) + 1}</span> },
    { key: 'number', label: 'Número', render: (row: Cattle) => <span className="font-semibold">{row.number ?? '—'}</span> },
    { key: 'receivedWeight', label: 'Peso Recibido', render: (row: Cattle) => row.receivedWeight != null ? `${row.receivedWeight} kg` : '—' },
    { key: 'lastWeight', label: 'Peso Actual', render: (row: Cattle) => row.lastWeight != null ? `${row.lastWeight} kg` : '—' },
    { key: 'status', label: 'Estado', render: (row: Cattle) => <Badge label={STATUS_LABELS[row.status ?? ''] ?? row.status ?? '—'} variant={statusVariant(row.status)} /> },
    { key: 'color', label: 'Color', render: (row: Cattle) => row.color ?? '—' },
    { key: 'gender', label: 'Género', render: (row: Cattle) => GENDER_LABELS[row.gender ?? ''] ?? row.gender ?? '—' },
    { key: '_actions', label: 'Acciones', render: (row: Cattle) => (
      <Link href={`/cattle/${row.id}`} className="text-primary font-semibold text-[0.8125rem] no-underline hover:underline" onClick={(e) => e.stopPropagation()}>
        Ver
      </Link>
    )},
  ];

  // Patch: DataTable doesn't pass idx, so we pass data with index baked in
  const indexedColumns = columns.map(col => {
    if (col.key === '_idx') {
      return {
        ...col,
        render: (row: Cattle) => {
          const idx = cattle.indexOf(row);
          return <span className="text-on-surface-muted">{(page - 1) * PAGE_SIZE + idx + 1}</span>;
        }
      };
    }
    return col;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">
          Ganado
        </h1>
        <Link href="/cattle/new" className="no-underline">
          <Button>+ Nuevo Animal</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por número..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface placeholder:text-on-surface-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
          style={{ minWidth: 200 }}
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
          style={{ minWidth: 140 }}
        >
          <option value="">Todos</option>
          <option value="active">Activo</option>
          <option value="sold">Vendido</option>
          <option value="deceased">Fallecido</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={indexedColumns}
        data={cattle}
        loading={loading}
        emptyMessage="No hay ganado registrado"
        onRowClick={(row) => router.push(`/cattle/${row.id}`)}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
