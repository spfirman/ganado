'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

interface Provider {
  id: number;
  name: string;
}

export default function NewPurchasePage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerId, setProviderId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await apiFetch<Provider[] | { data: Provider[] }>('/providers');
        setProviders(Array.isArray(res) ? res : res.data ?? []);
      } catch {
        // silent
      }
    }
    loadProviders();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiFetch('/purchases', {
        method: 'POST',
        body: JSON.stringify({
          providerId: Number(providerId),
          purchaseDate,
          comments,
        }),
      });
      router.push('/purchases');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la compra');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Link href="/purchases" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Compras
      </Link>
      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-6">
        Nueva Compra
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Select
            label="Proveedor"
            options={providers.map((p) => ({ value: String(p.id), label: p.name }))}
            placeholder="Seleccionar proveedor..."
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            required
          />
          <Input
            label="Fecha de Compra"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
          <div>
            <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Comentarios</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              style={{ resize: 'vertical' }}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Crear Compra'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
