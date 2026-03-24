'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface Brand {
  id: number;
  name: string;
  imageUrl?: string;
  image?: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const res = await apiFetch<Brand[] | { data: Brand[] }>('/brands');
      setBrands(Array.isArray(res) ? res : res.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar hierros');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formImage) {
        const fd = new FormData();
        fd.append('name', formName);
        fd.append('image', formImage);
        await apiFetch('/brands', {
          method: 'POST',
          body: fd,
          headers: {},
        });
      } else {
        await apiFetch('/brands', {
          method: 'POST',
          body: JSON.stringify({ name: formName }),
        });
      }
      setFormName('');
      setFormImage(null);
      setShowForm(false);
      setLoading(true);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear hierro');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Hierros</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Nuevo Hierro</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input label="Nombre" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Nombre del hierro" />
            <div>
              <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormImage(e.target.files?.[0] ?? null)}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear Hierro'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-9 h-9 border-3 border-border rounded-full border-t-primary animate-spin mx-auto" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {!loading && !error && brands.length === 0 && (
        <div className="text-center py-12 text-on-surface-muted">
          No hay hierros registrados
        </div>
      )}

      {!loading && brands.length > 0 && (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {brands.map((b) => (
            <Card key={b.id} padding="none" className="flex flex-col items-center overflow-hidden">
              <div className="w-full bg-surface flex items-center justify-center overflow-hidden" style={{ height: 160 }}>
                {(b.imageUrl || b.image) ? (
                  <img
                    src={b.imageUrl || b.image}
                    alt={b.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <span className="text-5xl text-border">&#9678;</span>
                )}
              </div>
              <div className="p-4 text-center font-semibold text-sm text-on-surface">
                {b.name}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
