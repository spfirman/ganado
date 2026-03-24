'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

interface Cattle {
  id: number;
  earTag?: string;
  breed?: string;
  weight?: number;
  sex?: string;
}

interface PurchaseDetail {
  id: number;
  purchaseDate: string;
  providerName?: string;
  provider?: { name: string };
  totalAnimals?: number;
  totalWeight?: number;
  totalPrice?: number;
  status?: string;
  comments?: string;
  cattle?: Cattle[];
  items?: Cattle[];
}

export default function PurchaseDetailPage() {
  const params = useParams();
  const id = params.id;
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<PurchaseDetail>(`/purchases/${id}`);
        setPurchase(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar la compra');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const cattle = purchase?.cattle ?? purchase?.items ?? [];

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <Link href="/purchases" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
        &larr; Volver a Compras
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

      {purchase && (
        <>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>
            Compra #{purchase.id}
          </h1>

          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
            padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '2rem',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Proveedor</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>{purchase.providerName || purchase.provider?.name || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Fecha</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('es-GT') : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Total Animales</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>{purchase.totalAnimals ?? '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Peso Total</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>{purchase.totalWeight != null ? `${purchase.totalWeight} kg` : '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Precio Total</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' }}>{purchase.totalPrice != null ? `Q${purchase.totalPrice.toLocaleString()}` : '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Estado</div>
              <span style={{
                display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem',
                background: purchase.status === 'completed' ? '#dcfce7' : '#fef9c3',
                color: purchase.status === 'completed' ? '#166534' : '#854d0e',
              }}>
                {purchase.status || 'pendiente'}
              </span>
            </div>
          </div>

          {purchase.comments && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Comentarios</div>
              <p style={{ margin: 0, color: '#374151' }}>{purchase.comments}</p>
            </div>
          )}

          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Ganado Recibido
          </h2>

          {cattle.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No hay ganado registrado en esta compra
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Arete', 'Raza', 'Sexo', 'Peso'].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cattle.map((c, i) => (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                        <Link href={`/cattle/${c.id}`} style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                          {c.earTag || `#${c.id}`}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{c.breed || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{c.sex || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>{c.weight != null ? `${c.weight} kg` : '—'}</td>
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
