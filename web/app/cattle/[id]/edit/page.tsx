'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import CattleForm, { CattleFormData } from '../../../components/CattleForm';
import Card from '../../../components/ui/Card';

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
      <div className="p-8 text-center font-body text-on-surface-muted">
        Cargando...
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="font-body" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link href="/cattle" className="text-primary no-underline text-sm">
          ← Volver a Ganado
        </Link>
        <p className="text-error mt-4">{error || 'No se encontró el registro'}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link href={`/cattle/${id}`} className="text-primary no-underline text-sm font-body font-medium">
        ← Volver al Detalle
      </Link>
      <h1 className="font-heading text-2xl font-bold text-on-surface mt-4 mb-6">
        Editar Animal #{initialData.number || id}
      </h1>
      <Card>
        <CattleForm cattleId={id} initialData={initialData} />
      </Card>
    </div>
  );
}
