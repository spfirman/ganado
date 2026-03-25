'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';

interface Cattle {
  id: number | string;
  number?: string;
  earTag?: string;
  breed?: string;
  receivedWeight?: number;
  weight?: number;
  sex?: string;
  gender?: string;
  color?: string;
}

interface Lot {
  id: string;
  lotNumber: string;
  originPlace?: string;
  purchasedCattleCount: number;
  receivedCattleCount?: number;
  totalWeight?: number;
  pricePerKg?: number;
  totalValue?: number;
  gender?: string;
}

interface PurchaseDetail {
  id: number | string;
  purchaseDate: string;
  providerName?: string;
  provider?: { name: string };
  totalAnimals?: number;
  totalCattle?: number;
  totalWeight?: number;
  totalPrice?: number;
  status?: string;
  comments?: string;
  cattle?: Cattle[];
  items?: Cattle[];
  lots?: Lot[];
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
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Link href="/purchases" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Compras
      </Link>

      {loading && (
        <div className="text-center py-12">
          <div className="w-9 h-9 border-3 border-border rounded-full border-t-primary animate-spin mx-auto" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {purchase && (
        <>
          <div className="flex justify-between items-start mt-4 mb-2 flex-wrap gap-4">
            <h1 className="font-heading text-3xl font-bold text-on-surface m-0">
              Compra #{purchase.id}
            </h1>
            <Link href={`/receptions/${purchase.id}`} className="no-underline">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-on-primary hover:bg-primary-dark transition-colors cursor-pointer shadow-sm">
                Recepción
              </span>
            </Link>
          </div>

          <Card className="mb-8">
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Proveedor</div>
                <div className="text-base font-semibold mt-1">{purchase.providerName || purchase.provider?.name || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Fecha</div>
                <div className="text-base font-semibold mt-1">
                  {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('es-CO') : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Total Animales</div>
                <div className="text-base font-semibold mt-1">{purchase.totalAnimals ?? '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Peso Total</div>
                <div className="text-base font-semibold mt-1">{purchase.totalWeight != null ? `${purchase.totalWeight} kg` : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Precio Total</div>
                <div className="text-base font-semibold mt-1">{purchase.totalPrice != null ? `COP $${purchase.totalPrice.toLocaleString()}` : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-muted font-semibold uppercase">Estado</div>
                <div className="mt-1">
                  <Badge label={purchase.status || 'pendiente'} variant={purchase.status === 'completed' ? 'success' : 'warning'} />
                </div>
              </div>
            </div>
          </Card>

          {purchase.comments && (
            <div className="mb-8">
              <div className="text-xs text-on-surface-muted font-semibold uppercase mb-2">Comentarios</div>
              <p className="m-0 text-on-surface">{purchase.comments}</p>
            </div>
          )}

          {/* Lots table */}
          {(purchase.lots?.length ?? 0) > 0 && (
            <>
              <h2 className="font-heading text-xl font-semibold text-on-surface mb-4">
                Lotes ({purchase.lots!.length})
              </h2>
              <div className="mb-8">
                <DataTable
                  columns={[
                    { key: 'lotNumber', label: 'Lote #', render: (l: Lot) => <span className="font-semibold">{l.lotNumber}</span> },
                    { key: 'originPlace', label: 'Origen', render: (l: Lot) => l.originPlace || '—' },
                    { key: 'gender', label: 'Género', render: (l: Lot) => l.gender === 'MALE' ? 'Macho' : l.gender === 'FEMALE' ? 'Hembra' : (l.gender || '—') },
                    { key: 'purchasedCattleCount', label: '# Cabezas', render: (l: Lot) => l.purchasedCattleCount },
                    { key: 'receivedCattleCount', label: 'Recibidos', render: (l: Lot) => `${l.receivedCattleCount ?? 0}/${l.purchasedCattleCount}` },
                    { key: 'totalWeight', label: 'Peso Total', render: (l: Lot) => l.totalWeight != null ? `${l.totalWeight} kg` : '—' },
                    { key: 'pricePerKg', label: '$/Kg', render: (l: Lot) => l.pricePerKg != null ? `$${Number(l.pricePerKg).toLocaleString()}` : '—' },
                    { key: 'totalValue', label: 'Valor Total', render: (l: Lot) => l.totalValue != null ? `COP $${Number(l.totalValue).toLocaleString()}` : '—' },
                  ]}
                  data={purchase.lots!}
                  emptyMessage="No hay lotes"
                />
              </div>
            </>
          )}

          <h2 className="font-heading text-xl font-semibold text-on-surface mb-4">
            Ganado Recibido ({cattle.length}{purchase.totalCattle ? `/${purchase.totalCattle}` : ''})
          </h2>

          <DataTable
            columns={[
              { key: 'number', label: 'Número', render: (c: Cattle) => (
                <Link href={`/cattle/${c.id}`} className="text-primary font-semibold no-underline hover:underline">
                  {c.number || c.earTag || `#${c.id}`}
                </Link>
              )},
              { key: 'receivedWeight', label: 'Peso Recibido', render: (c: Cattle) => c.receivedWeight != null ? `${c.receivedWeight} kg` : '—' },
              { key: 'color', label: 'Color', render: (c: Cattle) => c.color || '—' },
              { key: 'gender', label: 'Género', render: (c: Cattle) => c.gender === 'MALE' ? 'Macho' : c.gender === 'FEMALE' ? 'Hembra' : (c.sex || c.gender || '—') },
              { key: 'weight', label: 'Último Peso', render: (c: Cattle) => c.weight != null ? `${c.weight} kg` : '—' },
            ]}
            data={cattle}
            emptyMessage="No hay ganado registrado en esta compra"
          />
        </>
      )}
    </div>
  );
}
