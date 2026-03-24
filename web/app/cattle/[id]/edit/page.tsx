'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import CattleForm, { CattleFormData } from '../../../components/CattleForm';

interface CattleDetail {
  id: number | string;
  number?: string;
  receivedWeight?: number;
  purchaseWeight?: number;
  purchasePrice?: number;
  lastWeight?: number;
  color?: string;
  gender?: string;
  status?: string;
  comments?: string;
  castrated?: boolean;
  hasHorn?: boolean;
  birthDateAprx?: string;
  eartagLeft?: string;
  eartagRight?: string;
}

export default function EditCattlePage() {
  const params = useParams();
  const id = params?.id as string;
  const [initialData, setInitialData] = useState<Partial<CattleFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await apiFetch<CattleDetail>(`/cattle/${id}`);
        setInitialData({
          number: res.number ?? '',
          receivedWeight: res.receivedWeight != null ? String(res.receivedWeight) : '',
          purchaseWeight: res.purchaseWeight != null ? String(res.purchaseWeight) : '',
          purchasePrice: res.purchasePrice != null ? String(res.purchasePrice) : '',
          lastWeight: res.lastWeight != null ? String(res.lastWeight) : '',
          color: res.color ?? '',
          gender: res.gender ?? '',
          status: res.status ?? 'active',
          comments: res.comments ?? '',
          castrated: res.castrated ?? false,
          hasHorn: res.hasHorn ?? false,
          birthDateAprx: res.birthDateAprx ?? '',
          eartagLeft: res.eartagLeft ?? '',
          eartagRight: res.eartagRight ?? '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'Manrope', sans-serif", color: '#9ca3af' }}>
        Cargando...
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        <Link href="/cattle" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Volver a Ganado
        </Link>
        <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error || 'No se encontró el registro'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Link href={`/cattle/${id}`} style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.875rem', fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}>
        ← Volver al Detalle
      </Link>
      <h1 style={{
        fontFamily: "'Noto Serif', serif",
        fontSize: '1.75rem',
        fontWeight: 700,
        margin: '1rem 0 1.5rem',
        color: 'var(--foreground)',
      }}>
        Editar Animal #{initialData.number || id}
      </h1>
      <div style={{
        background: 'var(--background, #fff)',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <CattleForm cattleId={id} initialData={initialData} />
      </div>
    </div>
  );
}
