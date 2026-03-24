'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Link from 'next/link';

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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: '0.875rem', fontFamily: "'Manrope', sans-serif", outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, margin: 0 }}>Eventos Masivos</h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.625rem 1.25rem', background: '#16a34a', color: '#fff',
          borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          + Nuevo Evento
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
          padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: '#374151' }}>Nombre</label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required style={inputStyle} placeholder="Nombre del evento" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: '#374151' }}>Descripcion</label>
            <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Descripcion del evento" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={submitting} style={{
              padding: '0.625rem 1.25rem', background: submitting ? '#9ca3af' : '#16a34a', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
            }}>
              {submitting ? 'Creando...' : 'Crear Evento'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              padding: '0.625rem 1.25rem', background: '#f3f4f6', color: '#374151',
              border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

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

      {!loading && !error && events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          No hay eventos registrados
        </div>
      )}

      {!loading && events.length > 0 && (
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Nombre', 'Descripcion', 'Estado', 'Fecha', 'Acciones'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{ev.name}</td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{ev.description || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{
                      display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
                      background: ev.status === 'open' ? '#dcfce7' : '#f3f4f6',
                      color: ev.status === 'open' ? '#166534' : '#6b7280',
                    }}>
                      {ev.status === 'open' ? 'Abierto' : ev.status === 'closed' ? 'Cerrado' : (ev.status || '—')}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                    {(ev.date || ev.createdAt) ? new Date(ev.date || ev.createdAt!).toLocaleDateString('es-GT') : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/events/${ev.id}`} style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
