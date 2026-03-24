'use client';

import { useEffect, useState, FormEvent } from 'react';
import { apiFetch } from '../lib/api';

interface Device {
  id: number;
  device_name?: string;
  deveui?: string;
  description?: string;
}

const emptyForm = { deviceName: '', deveui: '', description: '' };

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function loadDevices() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Device[] | { data: Device[] }>('/devices');
      setDevices(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar dispositivos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDevices(); }, []);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(d: Device) {
    setForm({
      deviceName: d.device_name ?? '',
      deveui: d.deveui ?? '',
      description: d.description ?? '',
    });
    setEditingId(d.id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        device_name: form.deviceName,
        deveui: form.deveui,
        description: form.description,
      };
      if (editingId) {
        await apiFetch(`/devices/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiFetch('/devices', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      setEditingId(null);
      await loadDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este dispositivo?')) return;
    try {
      await apiFetch(`/devices/${id}`, { method: 'DELETE' });
      await loadDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  if (loading) {
    return (
      <div style={s.wrapper}>
        <div style={s.spinner} />
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>Cargando dispositivos...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Dispositivos</h1>
        <button style={s.btnPrimary} onClick={openNew}>+ Nuevo Dispositivo</button>
      </div>

      {error && <div style={s.alert}>{error}</div>}

      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingId ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}</h2>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Nombre del Dispositivo</label>
                <input style={s.input} value={form.deviceName} onChange={e => setForm(p => ({ ...p, deviceName: e.target.value }))} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>DEVEUI</label>
                <input style={s.input} value={form.deveui} onChange={e => setForm(p => ({ ...p, deveui: e.target.value }))} required placeholder="Ej: 0004A30B001F1234" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Descripción</label>
                <textarea style={{ ...s.input, minHeight: 80, resize: 'vertical' as const }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" style={s.btnSecondary} onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" style={s.btnPrimary} disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>DEVEUI</th>
                <th style={s.th}>Descripción</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr><td colSpan={4} style={{ ...s.td, textAlign: 'center', color: '#9ca3af' }}>No hay dispositivos registrados</td></tr>
              ) : devices.map(d => (
                <tr key={d.id}>
                  <td style={s.td}>{d.device_name || '—'}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '0.8125rem' }}>{d.deveui || '—'}</td>
                  <td style={s.td}>{d.description || '—'}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={s.btnSmall} onClick={() => openEdit(d)}>Editar</button>
                      <button style={{ ...s.btnSmall, color: '#dc2626' }} onClick={() => handleDelete(d.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const PRIMARY = '#16a34a';

const s: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { padding: '2rem', maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' },
  th: { textAlign: 'left' as const, padding: '0.75rem 1rem', borderBottom: '2px solid #e5e7eb', fontWeight: 600, color: '#374151', background: '#f9fafb' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', color: 'var(--foreground)' },
  btnPrimary: { padding: '0.625rem 1.25rem', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  btnSecondary: { padding: '0.625rem 1.25rem', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  btnSmall: { padding: '0.375rem 0.75rem', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.8125rem', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' },
  modal: { background: 'var(--background, #fff)', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' as const },
  modalTitle: { fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--foreground)' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151' },
  input: { padding: '0.625rem 0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
};
