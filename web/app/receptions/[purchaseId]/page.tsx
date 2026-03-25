'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';

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
  gender: 'MALE',
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
          idPurchase: purchaseId,
          number: form.number,
          receivedWeight: Number(form.receivedWeight),
          purchaseWeight: Number(form.purchaseWeight) || undefined,
          purchasePrice: Number(form.purchasePrice) || undefined,
          idLot: form.lot || undefined,
          idBrand: form.brand || undefined,
          color: form.color || 'BLACK',
          gender: form.gender,
          eartagLeft: form.eartagLeft || undefined,
          eartagRight: form.eartagRight || undefined,
          castrated: form.castrated,
          hasHorn: form.hasHorn,
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-border rounded-full border-t-primary animate-spin" />
        <p className="text-on-surface-muted mt-4">Cargando recepción...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 className="font-heading text-3xl font-bold text-on-surface m-0 mb-6">Recepción de Compra</h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {/* Purchase info */}
      {purchase && (
        <Card className="mb-6">
          <h2 className="text-base font-bold text-on-surface m-0 mb-3">Información de la Compra</h2>
          <div className="grid gap-3 text-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            <div><span className="font-semibold text-on-surface">ID:</span> {purchase.id}</div>
            <div><span className="font-semibold text-on-surface">Proveedor:</span> {purchase.supplier_name ?? '—'}</div>
            <div><span className="font-semibold text-on-surface">Fecha:</span> {purchase.purchase_date ?? '—'}</div>
            <div><span className="font-semibold text-on-surface">Total Cabezas:</span> {purchase.total_cattle ?? '—'}</div>
            <div><span className="font-semibold text-on-surface">Estado:</span> {purchase.status ?? '—'}</div>
            <div><span className="font-semibold text-on-surface">Recibidos:</span> {received.length}</div>
          </div>
        </Card>
      )}

      {/* Reception form */}
      <Card className="mb-6">
        <h2 className="text-base font-bold text-on-surface m-0 mb-4">Registrar Animal</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            <Input label="Número" type="number" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} required />
            <Input label="Peso Recibido (kg)" type="number" step="0.01" value={form.receivedWeight} onChange={e => setForm(p => ({ ...p, receivedWeight: e.target.value }))} required />
            <Input label="Peso Compra (kg)" type="number" step="0.01" value={form.purchaseWeight} onChange={e => setForm(p => ({ ...p, purchaseWeight: e.target.value }))} required />
            <Input label="Precio Compra" type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm(p => ({ ...p, purchasePrice: e.target.value }))} required />
            <Input label="Lote" value={form.lot} onChange={e => setForm(p => ({ ...p, lot: e.target.value }))} />
            <Input label="Fierro / Marca" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
            <Input label="Color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
            <Select
              label="Género"
              options={[{ value: 'MALE', label: 'Macho' }, { value: 'FEMALE', label: 'Hembra' }]}
              value={form.gender}
              onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
            />
            <Input label="Arete Izquierdo" value={form.eartagLeft} onChange={e => setForm(p => ({ ...p, eartagLeft: e.target.value }))} />
            <Input label="Arete Derecho" value={form.eartagRight} onChange={e => setForm(p => ({ ...p, eartagRight: e.target.value }))} />
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface cursor-pointer">
                <input type="checkbox" checked={form.castrated} onChange={e => setForm(p => ({ ...p, castrated: e.target.checked }))} className="accent-primary" />
                Castrado
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface cursor-pointer">
                <input type="checkbox" checked={form.hasHorn} onChange={e => setForm(p => ({ ...p, hasHorn: e.target.checked }))} className="accent-primary" />
                Con Cuernos
              </label>
            </div>
          </div>
          <div className="mt-5">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Animal'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Received cattle list */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-border-light">
          <h2 className="text-base font-bold text-on-surface m-0">
            Animales Recibidos ({received.length})
          </h2>
        </div>
        <DataTable
          columns={[
            { key: 'number', label: '#', render: (c: ReceivedCattle, i?: number) => c.number ?? (i != null ? i + 1 : '—') },
            { key: 'received_weight', label: 'Peso Recibido', render: (c: ReceivedCattle) => c.received_weight ?? '—' },
            { key: 'purchase_weight', label: 'Peso Compra', render: (c: ReceivedCattle) => c.purchase_weight ?? '—' },
            { key: 'purchase_price', label: 'Precio', render: (c: ReceivedCattle) => c.purchase_price != null ? `$${c.purchase_price}` : '—' },
            { key: 'lot', label: 'Lote', render: (c: ReceivedCattle) => c.lot || '—' },
            { key: 'color', label: 'Color', render: (c: ReceivedCattle) => c.color || '—' },
            { key: 'gender', label: 'Género', render: (c: ReceivedCattle) => c.gender || '—' },
            { key: 'eartag_left', label: 'Arete Izq.', render: (c: ReceivedCattle) => c.eartag_left || '—' },
            { key: 'eartag_right', label: 'Arete Der.', render: (c: ReceivedCattle) => c.eartag_right || '—' },
          ]}
          data={received}
          emptyMessage="No se han recibido animales aún"
        />
      </Card>
    </div>
  );
}
