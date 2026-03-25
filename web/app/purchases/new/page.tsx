'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

interface Provider {
  id: number | string;
  name: string;
  type?: string;
}

interface Lot {
  lotNumber: string;
  originPlace: string;
  gender: string;
  purchasedCattleCount: number | '';
  totalWeight: number | '';
  pricePerKg: number | '';
}

function createEmptyLot(): Lot {
  return {
    lotNumber: '',
    originPlace: '',
    gender: '',
    purchasedCattleCount: '',
    totalWeight: '',
    pricePerKg: '',
  };
}

function lotTotalValue(lot: Lot): number {
  const w = typeof lot.totalWeight === 'number' ? lot.totalWeight : 0;
  const p = typeof lot.pricePerKg === 'number' ? lot.pricePerKg : 0;
  return w * p;
}

function formatNumber(n: number): string {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function NewPurchasePage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerId, setProviderId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [lots, setLots] = useState<Lot[]>([createEmptyLot()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await apiFetch<Provider[] | { data?: Provider[]; items?: Provider[] }>('/providers');
        const all = Array.isArray(res) ? res : res.items ?? res.data ?? [];
        setProviders(all.filter(p => !p.type || p.type === 'PROVIDER'));
      } catch {
        // silent
      }
    }
    loadProviders();
  }, []);

  const updateLot = useCallback((index: number, field: keyof Lot, value: string) => {
    setLots((prev) => {
      const updated = [...prev];
      const lot = { ...updated[index] };

      if (field === 'purchasedCattleCount' || field === 'totalWeight' || field === 'pricePerKg') {
        lot[field] = value === '' ? '' : Number(value);
      } else {
        (lot as Record<string, string>)[field] = value;
      }

      updated[index] = lot;
      return updated;
    });
  }, []);

  const addLot = useCallback(() => {
    setLots((prev) => [...prev, createEmptyLot()]);
  }, []);

  const removeLot = useCallback((index: number) => {
    setLots((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Summary calculations
  const totalCabezas = lots.reduce((sum, l) => sum + (typeof l.purchasedCattleCount === 'number' ? l.purchasedCattleCount : 0), 0);
  const totalPeso = lots.reduce((sum, l) => sum + (typeof l.totalWeight === 'number' ? l.totalWeight : 0), 0);
  const totalValor = lots.reduce((sum, l) => sum + lotTotalValue(l), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate lots
    for (let i = 0; i < lots.length; i++) {
      const l = lots[i];
      if (!l.lotNumber || !l.originPlace || !l.gender || l.purchasedCattleCount === '' || l.totalWeight === '' || l.pricePerKg === '') {
        setError(`Lote ${i + 1}: todos los campos son requeridos.`);
        setSubmitting(false);
        return;
      }
    }

    try {
      await apiFetch('/purchases', {
        method: 'POST',
        body: JSON.stringify({
          idProvider: providerId,
          purchaseDate,
          lots: lots.map((l) => ({
            lotNumber: l.lotNumber,
            originPlace: l.originPlace,
            purchasedCattleCount: Number(l.purchasedCattleCount),
            totalWeight: Number(l.totalWeight),
            pricePerKg: Number(l.pricePerKg),
            totalValue: lotTotalValue(l),
            gender: l.gender,
          })),
        }),
      });
      router.push('/purchases');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la compra');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link href="/purchases" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Compras
      </Link>
      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-6">
        Nueva Compra
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Provider and Date */}
        <Card>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Proveedor"
                options={providers.map((p) => ({ value: String(p.id), label: p.name }))}
                placeholder="Seleccionar proveedor..."
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                required
              />
              <Input
                label="Fecha de Compra"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Lots Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-on-surface">
              Lotes
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={addLot}>
              + Agregar Lote
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {lots.map((lot, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 bg-surface"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                    Lote {index + 1}
                  </span>
                  {lots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLot(index)}
                      className="text-error hover:bg-error/10 rounded-md px-2 py-1 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      &times; Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <Input
                    label="Lote #"
                    value={lot.lotNumber}
                    onChange={(e) => updateLot(index, 'lotNumber', e.target.value)}
                    placeholder="Ej: L-001"
                    required
                  />
                  <Input
                    label="Origen"
                    value={lot.originPlace}
                    onChange={(e) => updateLot(index, 'originPlace', e.target.value)}
                    placeholder="Lugar de origen"
                    required
                  />
                  <Select
                    label="Género"
                    options={[
                      { value: 'MALE', label: 'Macho' },
                      { value: 'FEMALE', label: 'Hembra' },
                    ]}
                    placeholder="Seleccionar..."
                    value={lot.gender}
                    onChange={(e) => updateLot(index, 'gender', e.target.value)}
                    required
                  />
                  <Input
                    label="# Cabezas"
                    type="number"
                    min={1}
                    value={lot.purchasedCattleCount === '' ? '' : String(lot.purchasedCattleCount)}
                    onChange={(e) => updateLot(index, 'purchasedCattleCount', e.target.value)}
                    placeholder="0"
                    required
                  />
                  <Input
                    label="Peso Total kg"
                    type="number"
                    min={0}
                    step="0.01"
                    value={lot.totalWeight === '' ? '' : String(lot.totalWeight)}
                    onChange={(e) => updateLot(index, 'totalWeight', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <Input
                    label="Precio/Kg"
                    type="number"
                    min={0}
                    step="0.01"
                    value={lot.pricePerKg === '' ? '' : String(lot.pricePerKg)}
                    onChange={(e) => updateLot(index, 'pricePerKg', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      Valor Total
                    </span>
                    <div className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface font-semibold">
                      ${formatNumber(lotTotalValue(lot))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <Card>
          <h2 className="font-heading text-lg font-bold text-on-surface mb-4">
            Resumen
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                Total Cabezas
              </p>
              <p className="text-2xl font-bold text-on-surface">
                {totalCabezas}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                Peso Total
              </p>
              <p className="text-2xl font-bold text-on-surface">
                {formatNumber(totalPeso)} kg
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                Valor Total
              </p>
              <p className="text-2xl font-bold text-primary">
                ${formatNumber(totalValor)}
              </p>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? 'Guardando...' : 'Crear Compra'}
          </Button>
        </div>
      </form>
    </div>
  );
}
