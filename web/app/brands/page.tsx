'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: '0.875rem', fontFamily: "'Manrope', sans-serif", outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, margin: 0 }}>Hierros</h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.625rem 1.25rem', background: '#16a34a', color: '#fff',
          borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          + Nuevo Hierro
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
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required style={inputStyle} placeholder="Nombre del hierro" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: '#374151' }}>Imagen</label>
            <input type="file" accept="image/*" onChange={(e) => setFormImage(e.target.files?.[0] ?? null)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={submitting} style={{
              padding: '0.625rem 1.25rem', background: submitting ? '#9ca3af' : '#16a34a', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
            }}>
              {submitting ? 'Creando...' : 'Crear Hierro'}
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

      {!loading && !error && brands.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          No hay hierros registrados
        </div>
      )}

      {!loading && brands.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem',
        }}>
          {brands.map((b) => (
            <div key={b.id} style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                width: '100%', height: 160, background: '#f9fafb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {(b.imageUrl || b.image) ? (
                  <img
                    src={b.imageUrl || b.image}
                    alt={b.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: '3rem', color: '#d1d5db' }}>&#9678;</span>
                )}
              </div>
              <div style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                {b.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
