'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

interface SaleDetail {
  id: number;
  cattleNumber?: string;
  cattleId?: number;
  weight?: number;
  pricePerKg?: number;
  totalPrice?: number;
  status?: string;
}

interface Sale {
  id: number;
  saleDate: string;
  buyerName?: string;
  buyerDocument?: string;
  transporterName?: string;
  totalAnimals?: number;
  totalWeight?: number;
  totalPrice?: number;
  status?: string;
  notes?: string;
  details?: SaleDetail[];
}

export default function SaleDetailPage() {
  const params = useParams();
  const id = params.id;
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<Sale>(`/sales/${id}`);
        setSale(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar la venta');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const detailColumns = [
    { key: 'cattleNumber', label: 'Número Animal', render: (d: SaleDetail) => (
      <span className="font-semibold">{d.cattleNumber || '—'}</span>
    )},
    { key: 'weight', label: 'Peso (kg)', render: (d: SaleDetail) => d.weight != null ? `${d.weight} kg` : '—' },
    { key: 'pricePerKg', label: 'Precio/kg', render: (d: SaleDetail) => d.pricePerKg != null ? `COP $${d.pricePerKg.toLocaleString()}` : '—' },
    { key: 'totalPrice', label: 'Total', render: (d: SaleDetail) => d.totalPrice != null ? `COP $${d.totalPrice.toLocaleString()}` : '—' },
    { key: 'status', label: 'Estado', render: (d: SaleDetail) => (
      <Badge
        label={d.status === 'approved' ? 'Aprobado' : d.status === 'pending' ? 'Pendiente' : d.status === 'rejected' ? 'Rechazado' : (d.status || 'Pendiente')}
        variant={d.status === 'approved' ? 'success' : d.status === 'rejected' ? 'error' : 'warning'}
      />
    )},
  ];

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Link href="/sales" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Ventas
      </Link>

      {loading && (
        <div className="text-center py-12">
          <div className="w-9 h-9 border-3 border-border rounded-full border-t-primary animate-spin mx-auto" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4 mt-4">{error}</div>
      )}

      {sale && (
        <>
          <div className="flex justify-between items-start mt-4 mb-6 flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-on-surface m-0">
                Venta #{sale.id}
              </h1>
              <p className="text-on-surface-muted mt-1 mb-0 text-sm">
                {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>
            </div>
            <Badge
              label={sale.status === 'completed' ? 'Completada' : sale.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
              variant={sale.status === 'completed' ? 'success' : sale.status === 'cancelled' ? 'error' : 'warning'}
            />
          </div>

          {/* Sale Summary */}
          <Card className="mb-8">
            <h2 className="text-lg font-bold text-on-surface m-0 mb-4">Resumen de Venta</h2>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Fecha</div>
                <div className="text-base font-semibold mt-1">
                  {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('es-CO') : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Comprador</div>
                <div className="text-base font-semibold mt-1">{sale.buyerName || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Transportador</div>
                <div className="text-base font-semibold mt-1">{sale.transporterName || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Total Animales</div>
                <div className="text-base font-semibold mt-1">{sale.totalAnimals ?? '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Peso Total</div>
                <div className="text-base font-semibold mt-1">{sale.totalWeight != null ? `${sale.totalWeight} kg` : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Monto Total</div>
                <div className="text-xl font-bold mt-1" style={{ color: 'var(--gold-accent)' }}>
                  {sale.totalPrice != null ? `COP $${sale.totalPrice.toLocaleString()}` : '—'}
                </div>
              </div>
            </div>
            {sale.notes && (
              <div className="mt-4 pt-4 border-t border-border-light">
                <div className="text-xs text-on-surface-muted font-semibold uppercase mb-1">Notas</div>
                <p className="text-sm text-on-surface m-0">{sale.notes}</p>
              </div>
            )}
          </Card>

          {/* Sale Details Table */}
          <h2 className="font-heading text-xl font-semibold text-on-surface mb-4">
            Detalle de Animales
          </h2>
          <DataTable
            columns={detailColumns}
            data={sale.details ?? []}
            emptyMessage="No hay detalles de animales registrados"
          />
        </>
      )}
    </div>
  );
}
