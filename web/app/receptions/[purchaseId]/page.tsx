'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';

interface Purchase {
  id: number;
  supplier_name?: string;
  purchase_date?: string;
  total_cattle?: number;
  status?: string;
  [key: string]: unknown;
}

interface ReceivedCattle {
  id?: number;
  number?: number;
  received_weight?: number;
  purchase_weight?: number;
  purchase_price?: number;
  lot?: string;
  brand?: string;
  color?: string;
  gender?: string;
  eartag_left?: string;
  eartag_right?: string;
  castrated?: boolean;
  has_horn?: boolean;
}

const emptyForm = {
  number: '',
  receivedWeight: '',
  purchaseWeight: '',
  purchasePrice: '',
  lot: '',
  brand: '',
  color: '',
  gender: 'macho',
  eartagLeft: '',
  eartagRight: '',
  castrated: false,
  hasHorn: false,
};

export default function ReceptionPage() {
  const params = useParams();
  const purchaseId = params.purchaseId as string;

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [received, setReceived] = useState<ReceivedCattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [purchaseData, receptionData] = await Promise.all([
        apiFetch<Purchase>(`/purchases/${purchaseId}`),
        apiFetch<ReceivedCattle[] | { data: ReceivedCattle[] }>(`/purchase-receptions/${purchaseId}/cattle`).catch(() => []),
      ]);
      setPurchase(purchaseData);
      setReceived(Array.isArray(receptionData) ? receptionData : (receptionData as { data: ReceivedCattle[] }).data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de la compra');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [purchaseId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch('/purchase-receptions/receive-cattle', {
        method: 'POST',
        body: JSON.stringify({
          purchase_id: Number(purchaseId),
          number: Number(form.number),
          received_weight: Number(form.receivedWeight),
          purchase_weight: Number(form.purchaseWeight),
          purchase_price: Number(form.purchasePrice),
          lot: form.lot,
          brand: form.brand,
          color: form.color,
          gender: form.gender,
          eartag_left: form.eartagLeft,
          eartag_right: form.eartagRight,
          castrated: form.castrated,
          has_horn: form.hasHorn,
        }),
      });
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar animal');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={s.wrapper}>
        <div style={s.spinner} />
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>Cargando recepción...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Recepción de Compra</h1>

      {error && <div style={s.alert}>{error}</div>}

      {/* Purchase info */}
      {purchase && (
        <div style={{ ...s.card, padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--foreground)' }}>Información de la Compra</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div><span style={s.infoLabel}>ID:</span> {purchase.id}</div>
            <div><span style={s.infoLabel}>Proveedor:</span> {purchase.supplier_name ?? '—'}</div>
            <div><span style={s.infoLabel}>Fecha:</span> {purchase.purchase_date ?? '—'}</div>
            <div><span style={s.infoLabel}>Total Cabezas:</span> {purchase.total_cattle ?? '—'}</div>
            <div><span style={s.infoLabel}>Estado:</span> {purchase.status ?? '—'}</div>
            <div><span style={s.infoLabel}>Recibidos:</span> {received.length}</div>
          </div>
        </div>
      )}

      {/* Reception form */}
      <div style={{ ...s.card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--foreground)' }}>Registrar Animal</h2>
        <form onSubmit={handleSubmit}>
          <div style={s.fieldGrid}>
            <div style={s.field}>
              <label style={s.label}>Número</label>
              <input style={s.input} type="number" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Peso Recibido (kg)</label>
              <input style={s.input} type="number" step="0.01" value={form.receivedWeight} onChange={e => setForm(p => ({ ...p, receivedWeight: e.target.value }))} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Peso Compra (kg)</label>
              <input style={s.input} type="number" step="0.01" value={form.purchaseWeight} onChange={e => setForm(p => ({ ...p, purchaseWeight: e.target.value }))} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Precio Compra</label>
              <input style={s.input} type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm(p => ({ ...p, purchasePrice: e.target.value }))} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Lote</label>
              <input style={s.input} value={form.lot} onChange={e => setForm(p => ({ ...p, lot: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Fierro / Marca</label>
              <input style={s.input} value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Color</label>
              <input style={s.input} value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Género</label>
              <select style={s.input} value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Arete Izquierdo</label>
              <input style={s.input} value={form.eartagLeft} onChange={e => setForm(p => ({ ...p, eartagLeft: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Arete Derecho</label>
              <input style={s.input} value={form.eartagRight} onChange={e => setForm(p => ({ ...p, eartagRight: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={{ ...s.label, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.castrated} onChange={e => setForm(p => ({ ...p, castrated: e.target.checked }))} />
                Castrado
              </label>
            </div>
            <div style={s.field}>
              <label style={{ ...s.label, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.hasHorn} onChange={e => setForm(p => ({ ...p, hasHorn: e.target.checked }))} />
                Con Cuernos
              </label>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button type="submit" style={s.btnPrimary} disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Animal'}
            </button>
          </div>
        </form>
      </div>

      {/* Received cattle list */}
      <div style={s.card}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>
            Animales Recibidos ({received.length})
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Peso Recibido</th>
                <th style={s.th}>Peso Compra</th>
                <th style={s.th}>Precio</th>
                <th style={s.th}>Lote</th>
                <th style={s.th}>Color</th>
                <th style={s.th}>Género</th>
                <th style={s.th}>Arete Izq.</th>
                <th style={s.th}>Arete Der.</th>
              </tr>
            </thead>
            <tbody>
              {received.length === 0 ? (
                <tr><td colSpan={9} style={{ ...s.td, textAlign: 'center', color: '#9ca3af' }}>No se han recibido animales aún</td></tr>
              ) : received.map((c, i) => (
                <tr key={c.id ?? i}>
                  <td style={s.td}>{c.number ?? i + 1}</td>
                  <td style={s.td}>{c.received_weight ?? '—'}</td>
                  <td style={s.td}>{c.purchase_weight ?? '—'}</td>
                  <td style={s.td}>{c.purchase_price != null ? `$${c.purchase_price}` : '—'}</td>
                  <td style={s.td}>{c.lot || '—'}</td>
                  <td style={s.td}>{c.color || '—'}</td>
                  <td style={s.td}>{c.gender || '—'}</td>
                  <td style={s.td}>{c.eartag_left || '—'}</td>
                  <td style={s.td}>{c.eartag_right || '—'}</td>
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
  container: { padding: '2rem', maxWidth: 1200, margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 700, margin: '0 0 1.5rem', color: 'var(--foreground)' },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  fieldGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151' },
  input: { padding: '0.625rem 0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
  infoLabel: { fontWeight: 600, color: '#374151' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.8125rem' },
  th: { textAlign: 'left' as const, padding: '0.625rem 0.75rem', borderBottom: '2px solid #e5e7eb', fontWeight: 600, color: '#374151', background: '#f9fafb', fontSize: '0.75rem', whiteSpace: 'nowrap' as const },
  td: { padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: 'var(--foreground)' },
  btnPrimary: { padding: '0.625rem 1.5rem', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
};
