'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';

const TYPES = ['PROVIDER', 'BUYER', 'TRANSPORTER', 'VET', 'OTHER'] as const;

interface Provider {
  id: number;
  name: string;
  nit?: string;
  type?: string;
}

export default function EditProviderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [name, setName] = useState('');
  const [nit, setNit] = useState('');
  const [type, setType] = useState('PROVIDER');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<Provider>(`/providers/${id}`);
        setName(res.name ?? '');
        setNit(res.nit ?? '');
        setType(res.type ?? 'PROVIDER');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar el proveedor');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiFetch(`/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, nit, type }),
      });
      router.push('/providers');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el proveedor');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: '0.875rem', fontFamily: "'Manrope', sans-serif", outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: '#374151',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <Link href="/providers" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
        &larr; Volver a Proveedores
      </Link>
      <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, marginTop: '1rem', marginBottom: '1.5rem' }}>
        Editar Proveedor
      </h1>

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

      {!loading && (
        <form onSubmit={handleSubmit} style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
          padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          <div>
            <label style={labelStyle}>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>NIT</label>
            <input type="text" value={nit} onChange={(e) => setNit(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required style={inputStyle}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={submitting} style={{
            padding: '0.75rem 1.5rem', background: submitting ? '#9ca3af' : '#16a34a', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
          }}>
            {submitting ? 'Guardando...' : 'Actualizar Proveedor'}
          </button>
        </form>
      )}
    </div>
  );
}
