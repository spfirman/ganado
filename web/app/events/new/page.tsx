'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function NewEventPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await apiFetch<{ id: string }>('/massive-events', {
        method: 'POST',
        body: JSON.stringify({
          eventDate: eventDate || new Date().toISOString(),
          name: name || undefined,
        }),
      });
      router.push(`/events/${res.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear evento');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Link href="/events" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Eventos
      </Link>
      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-6">
        Nuevo Evento Masivo
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nombre (opcional)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Jornada de vacunación marzo"
          />
          <Input
            label="Fecha del Evento"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear Evento'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
