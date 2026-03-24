'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

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
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <Link href="/events" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
        &larr; Volver a Eventos
      </Link>

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

      {event && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, margin: 0 }}>{event.name}</h1>
              {event.description && <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>{event.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {event.status === 'open' && (
                <>
                  <Link href={`/events/${id}/apply`} style={{
                    display: 'inline-flex', alignItems: 'center', padding: '0.625rem 1.25rem',
                    background: '#2563eb', color: '#fff', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
                  }}>
                    Aplicar a Ganado
                  </Link>
                  <button onClick={handleClose} disabled={closing} style={{
                    padding: '0.625rem 1.25rem', background: closing ? '#9ca3af' : '#dc2626', color: '#fff',
                    border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: closing ? 'not-allowed' : 'pointer',
                  }}>
                    {closing ? 'Cerrando...' : 'Cerrar Evento'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
            padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '2rem',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Estado</div>
              <span style={{
                display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem',
                background: event.status === 'open' ? '#dcfce7' : '#f3f4f6',
                color: event.status === 'open' ? '#166534' : '#6b7280',
              }}>
                {event.status === 'open' ? 'Abierto' : event.status === 'closed' ? 'Cerrado' : (event.status || '—')}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Fecha de Creacion</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                {event.createdAt ? new Date(event.createdAt).toLocaleDateString('es-GT') : '—'}
              </div>
            </div>
            {event.closedAt && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Fecha de Cierre</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {new Date(event.closedAt).toLocaleDateString('es-GT')}
                </div>
              </div>
            )}
          </div>

          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Eventos Simples
          </h2>

          {simpleEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No hay eventos simples registrados
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Nombre', 'Tipo', 'Descripcion', 'Fecha', 'Estado'].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {simpleEvents.map((se, i) => (
                    <tr key={se.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{se.name || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{se.type || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{se.description || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                        {se.date ? new Date(se.date).toLocaleDateString('es-GT') : '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{se.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
