'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';

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

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activo' },
  { value: 'sold', label: 'Vendido' },
  { value: 'deceased', label: 'Fallecido' },
];

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  sold: 'Vendido',
  deceased: 'Fallecido',
  ACTIVE: 'Activo',
  SOLD: 'Vendido',
  DECEASED: 'Fallecido',
};

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Macho',
  FEMALE: 'Hembra',
  male: 'Macho',
  female: 'Hembra',
};

const PAGE_SIZE = 20;

export default function CattleListPage() {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    outline: 'none',
    background: 'var(--background, #fff)',
    color: 'var(--foreground, #111)',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{
          fontFamily: "'Noto Serif', serif",
          fontSize: '2rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--foreground)',
        }}>
          Ganado
        </h1>
        <Link href="/cattle/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1.25rem',
          background: '#16a34a',
          color: '#fff',
          borderRadius: 8,
          fontFamily: "'Manrope', sans-serif",
          fontSize: '0.875rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          + Nuevo Animal
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por número..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ ...inputStyle, minWidth: 200, flex: 1 }}
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          style={{ ...inputStyle, minWidth: 140 }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '0.875rem',
        }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['#', 'Número', 'Peso Recibido', 'Peso Actual', 'Estado', 'Color', 'Género', 'Acciones'].map((h) => (
                <th key={h} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Cargando...</td></tr>
            ) : cattle.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No hay ganado registrado</td></tr>
            ) : (
              cattle.map((c, idx) => (
                <tr key={c.id} style={{
                  background: idx % 2 === 0 ? 'var(--background, #fff)' : '#f9fafb',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                }} onClick={() => window.location.href = `/cattle/${c.id}`}>
                  <td style={{ padding: '0.625rem 1rem', color: '#6b7280' }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td style={{ padding: '0.625rem 1rem', fontWeight: 600 }}>{c.number ?? '—'}</td>
                  <td style={{ padding: '0.625rem 1rem' }}>{c.receivedWeight != null ? `${c.receivedWeight} kg` : '—'}</td>
                  <td style={{ padding: '0.625rem 1rem' }}>{c.lastWeight != null ? `${c.lastWeight} kg` : '—'}</td>
                  <td style={{ padding: '0.625rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: c.status === 'active' || c.status === 'ACTIVE' ? '#dcfce7' : c.status === 'sold' || c.status === 'SOLD' ? '#fef9c3' : '#fee2e2',
                      color: c.status === 'active' || c.status === 'ACTIVE' ? '#166534' : c.status === 'sold' || c.status === 'SOLD' ? '#854d0e' : '#991b1b',
                    }}>
                      {STATUS_LABELS[c.status ?? ''] ?? c.status ?? '—'}
                    </span>
                  </td>
                  <td style={{ padding: '0.625rem 1rem' }}>{c.color ?? '—'}</td>
                  <td style={{ padding: '0.625rem 1rem' }}>{GENDER_LABELS[c.gender ?? ''] ?? c.gender ?? '—'}</td>
                  <td style={{ padding: '0.625rem 1rem' }}>
                    <Link href={`/cattle/${c.id}`} style={{
                      color: '#16a34a',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                    }} onClick={(e) => e.stopPropagation()}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1.25rem',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '0.875rem',
        }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: page <= 1 ? '#f3f4f6' : 'var(--background, #fff)',
              color: page <= 1 ? '#9ca3af' : 'var(--foreground, #111)',
              cursor: page <= 1 ? 'default' : 'pointer',
            }}
          >
            Anterior
          </button>
          <span style={{ color: '#6b7280' }}>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: page >= totalPages ? '#f3f4f6' : 'var(--background, #fff)',
              color: page >= totalPages ? '#9ca3af' : 'var(--foreground, #111)',
              cursor: page >= totalPages ? 'default' : 'pointer',
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
