'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

  return (
    <div className="font-body" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Link href="/sales" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Ventas
      </Link>
      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-6">
        Nueva Venta
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input label="Nombre del Comprador" type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required placeholder="Nombre completo" />
          <Input label="NIT del Comprador" type="text" value={buyerNit} onChange={(e) => setBuyerNit(e.target.value)} placeholder="NIT" />
          <Input label="Fecha de Venta" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required />
          <div>
            <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Comentarios</label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150" style={{ resize: 'vertical' }} />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Crear Venta'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
