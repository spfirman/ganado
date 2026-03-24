'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';

interface SimpleEvent {
  id: number;
  name?: string;
  type?: string;
  description?: string;
  date?: string;
  status?: string;
}

interface MassiveEvent {
  id: number;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  closedAt?: string;
  date?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id;
  const [event, setEvent] = useState<MassiveEvent | null>(null);
  const [simpleEvents, setSimpleEvents] = useState<SimpleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [ev, subs] = await Promise.all([
          apiFetch<MassiveEvent>(`/massive-events/${id}`),
          apiFetch<SimpleEvent[] | { data: SimpleEvent[] }>(`/simple-events/by-massive-event/${id}`).catch(() => []),
        ]);
        setEvent(ev);
        setSimpleEvents(Array.isArray(subs) ? subs : (subs as { data: SimpleEvent[] }).data ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar el evento');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleClose() {
    if (!confirm('Seguro que desea cerrar este evento?')) return;
    setClosing(true);
    try {
      const updated = await apiFetch<MassiveEvent>(`/massive-events/close/${id}`, { method: 'PUT' });
      setEvent(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cerrar el evento');
    } finally {
      setClosing(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Link href="/events" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Eventos
      </Link>

      {loading && (
        <div className="text-center py-12">
          <div className="w-9 h-9 border-3 border-border rounded-full border-t-primary animate-spin mx-auto" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {event && (
        <>
          <div className="flex justify-between items-start mt-4 mb-6 flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-on-surface m-0">{event.name}</h1>
              {event.description && <p className="text-on-surface-muted mt-1 mb-0">{event.description}</p>}
            </div>
            <div className="flex gap-3">
              {event.status === 'open' && (
                <>
                  <Link href={`/events/${id}/apply`} className="no-underline">
                    <Button variant="secondary">Aplicar a Ganado</Button>
                  </Link>
                  <Button variant="danger" onClick={handleClose} disabled={closing}>
                    {closing ? 'Cerrando...' : 'Cerrar Evento'}
                  </Button>
                </>
              )}
            </div>
          </div>

          <Card className="mb-8">
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Estado</div>
                <div className="mt-1">
                  <Badge
                    label={event.status === 'open' ? 'Abierto' : event.status === 'closed' ? 'Cerrado' : (event.status || '—')}
                    variant={event.status === 'open' ? 'success' : 'neutral'}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Fecha de Creacion</div>
                <div className="text-base font-semibold mt-1">
                  {event.createdAt ? new Date(event.createdAt).toLocaleDateString('es-CO') : '—'}
                </div>
              </div>
              {event.closedAt && (
                <div>
                  <div className="text-xs text-on-surface-muted font-semibold uppercase">Fecha de Cierre</div>
                  <div className="text-base font-semibold mt-1">
                    {new Date(event.closedAt).toLocaleDateString('es-CO')}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <h2 className="font-heading text-xl font-semibold text-on-surface mb-4">
            Eventos Simples
          </h2>

          <DataTable
            columns={[
              { key: 'name', label: 'Nombre', render: (se: SimpleEvent) => <span className="font-semibold">{se.name || '—'}</span> },
              { key: 'type', label: 'Tipo', render: (se: SimpleEvent) => se.type || '—' },
              { key: 'description', label: 'Descripcion', render: (se: SimpleEvent) => se.description || '—' },
              { key: 'date', label: 'Fecha', render: (se: SimpleEvent) => se.date ? new Date(se.date).toLocaleDateString('es-CO') : '—' },
              { key: 'status', label: 'Estado', render: (se: SimpleEvent) => se.status || '—' },
            ]}
            data={simpleEvents}
            emptyMessage="No hay eventos simples registrados"
          />
        </>
      )}
    </div>
  );
}
