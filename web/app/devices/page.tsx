'use client';

import { useEffect, useState, FormEvent } from 'react';
import { apiFetch } from '../lib/api';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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

  const columns = [
    { key: 'device_name', label: 'Nombre', render: (d: Device) => d.device_name || '—' },
    { key: 'deveui', label: 'DEVEUI', render: (d: Device) => <code className="text-[0.8125rem] font-mono">{d.deveui || '—'}</code> },
    { key: 'description', label: 'Descripción', render: (d: Device) => d.description || '—' },
    { key: '_actions', label: 'Acciones', render: (d: Device) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => openEdit(d)}>Editar</Button>
        <Button size="sm" variant="danger" onClick={() => handleDelete(d.id)}>Eliminar</Button>
      </div>
    )},
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Dispositivos</h1>
        <Button onClick={openNew}>+ Nuevo Dispositivo</Button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nombre del Dispositivo" value={form.deviceName} onChange={e => setForm(p => ({ ...p, deviceName: e.target.value }))} required />
          <Input label="DEVEUI" value={form.deveui} onChange={e => setForm(p => ({ ...p, deveui: e.target.value }))} required placeholder="Ej: 0004A30B001F1234" />
          <div>
            <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Descripción</label>
            <textarea
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              style={{ minHeight: 80, resize: 'vertical' }}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>

      <DataTable columns={columns} data={devices} loading={loading} emptyMessage="No hay dispositivos registrados" />
    </div>
  );
}
