'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

export default function NewSalePage() {
  const router = useRouter();
  const [buyerName, setBuyerName] = useState('');
  const [buyerNit, setBuyerNit] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiFetch('/sales', {
        method: 'POST',
        body: JSON.stringify({ buyerName, buyerNit, saleDate, comments }),
      });
      router.push('/sales');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la venta');
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
      <Link href="/sales" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
        &larr; Volver a Ventas
      </Link>
      <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, marginTop: '1rem', marginBottom: '1.5rem' }}>
        Nueva Venta
      </h1>

      {error && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: 8, marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
        padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
      }}>
        <div>
          <label style={labelStyle}>Nombre del Comprador</label>
          <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required style={inputStyle} placeholder="Nombre completo" />
        </div>

        <div>
          <label style={labelStyle}>NIT del Comprador</label>
          <input type="text" value={buyerNit} onChange={(e) => setBuyerNit(e.target.value)} style={inputStyle} placeholder="NIT" />
        </div>

        <div>
          <label style={labelStyle}>Fecha de Venta</label>
          <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Comentarios</label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <button type="submit" disabled={submitting} style={{
          padding: '0.75rem 1.5rem', background: submitting ? '#9ca3af' : '#16a34a', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
        }}>
          {submitting ? 'Guardando...' : 'Crear Venta'}
        </button>
      </form>
    </div>
  );
}
