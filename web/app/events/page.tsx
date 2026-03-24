'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

interface MassiveEvent {
  id: number;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  date?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<MassiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const res = await apiFetch<MassiveEvent[] | { data: MassiveEvent[] }>('/massive-events');
      setEvents(Array.isArray(res) ? res : res.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/massive-events', {
        method: 'POST',
        body: JSON.stringify({ name: formName, description: formDesc }),
      });
      setFormName('');
      setFormDesc('');
      setShowForm(false);
      setLoading(true);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear evento');
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: 'name', label: 'Nombre', render: (ev: MassiveEvent) => <span className="font-semibold">{ev.name}</span> },
    { key: 'description', label: 'Descripcion', render: (ev: MassiveEvent) => ev.description || '—' },
    { key: 'status', label: 'Estado', render: (ev: MassiveEvent) => (
      <Badge
        label={ev.status === 'open' ? 'Abierto' : ev.status === 'closed' ? 'Cerrado' : (ev.status || '—')}
        variant={ev.status === 'open' ? 'success' : 'neutral'}
      />
    )},
    { key: 'date', label: 'Fecha', render: (ev: MassiveEvent) => (ev.date || ev.createdAt) ? new Date(ev.date || ev.createdAt!).toLocaleDateString('es-CO') : '—' },
    { key: '_actions', label: 'Acciones', render: (ev: MassiveEvent) => (
      <Link href={`/events/${ev.id}`} className="text-primary font-semibold no-underline hover:underline text-sm">Ver</Link>
    )},
  ];

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Eventos Masivos</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Nuevo Evento</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input label="Nombre" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Nombre del evento" />
            <div>
              <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Descripcion</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150" style={{ resize: 'vertical' }} placeholder="Descripcion del evento" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear Evento'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <DataTable columns={columns} data={events} loading={loading} emptyMessage="No hay eventos registrados" />
    </div>
  );
}
