'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

interface Provider {
  id: string;
  name: string;
  type: string;
}

interface CattleResult {
  id: string;
  number: string;
  name?: string;
}

interface SaleDetail {
  cattleId: string;
  cattleNumber: string;
  measuredWeight: number;
  isApproved: boolean;
  rejectionReason?: string;
  trackerRemoved: boolean;
  calculatedPrice: number;
}

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NewSalePage() {
  const router = useRouter();

  // Config state
  const [buyerId, setBuyerId] = useState('');
  const [transporterId, setTransporterId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [minWeightConfig, setMinWeightConfig] = useState<number>(0);
  const [valuePerKgConfig, setValuePerKgConfig] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Providers
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Cattle search
  const [cattleSearch, setCattleSearch] = useState('');
  const [searchingCattle, setSearchingCattle] = useState(false);
  const [cattleError, setCattleError] = useState('');
  const [foundCattle, setFoundCattle] = useState<CattleResult | null>(null);
  const [weightInput, setWeightInput] = useState('');

  // Sale details
  const [details, setDetails] = useState<SaleDetail[]>([]);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch providers on mount
  useEffect(() => {
    async function loadProviders() {
      try {
        const data = await apiFetch<Provider[]>('/providers');
        setProviders(Array.isArray(data) ? data : []);
      } catch {
        setProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    }
    loadProviders();
  }, []);

  const buyerOptions = providers
    .filter((p) => p.type === 'BUYER')
    .map((p) => ({ value: p.id, label: p.name }));

  const transporterOptions = providers
    .filter((p) => p.type === 'TRANSPORTER')
    .map((p) => ({ value: p.id, label: p.name }));

  // Computed totals
  const totalAnimalCount = details.length;
  const totalWeightKg = details.reduce((sum, d) => sum + d.measuredWeight, 0);
  const totalAmount = details.reduce((sum, d) => sum + d.calculatedPrice, 0);

  // Recalculate approval and prices when config changes
  const recalculateDetails = useCallback(
    (currentDetails: SaleDetail[], minW: number, priceKg: number): SaleDetail[] =>
      currentDetails.map((d) => ({
        ...d,
        isApproved: d.measuredWeight >= minW,
        calculatedPrice: d.measuredWeight * priceKg,
      })),
    [],
  );

  useEffect(() => {
    setDetails((prev) => recalculateDetails(prev, minWeightConfig, valuePerKgConfig));
  }, [minWeightConfig, valuePerKgConfig, recalculateDetails]);

  // Search cattle
  async function handleSearchCattle() {
    if (!cattleSearch.trim()) return;
    setSearchingCattle(true);
    setCattleError('');
    setFoundCattle(null);
    try {
      const result = await apiFetch<CattleResult>(
        `/cattle/validate-number/${encodeURIComponent(cattleSearch.trim())}`,
      );
      // Check if already added
      if (details.some((d) => d.cattleId === result.id)) {
        setCattleError('Este animal ya fue agregado a la lista.');
        return;
      }
      setFoundCattle(result);
      setWeightInput('');
    } catch (err: unknown) {
      setCattleError(err instanceof Error ? err.message : 'Animal no encontrado');
    } finally {
      setSearchingCattle(false);
    }
  }

  // Add cattle to details
  function handleAddCattle() {
    if (!foundCattle || !weightInput) return;
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return;

    const newDetail: SaleDetail = {
      cattleId: foundCattle.id,
      cattleNumber: foundCattle.number,
      measuredWeight: weight,
      isApproved: weight >= minWeightConfig,
      trackerRemoved: false,
      calculatedPrice: weight * valuePerKgConfig,
    };

    setDetails((prev) => [...prev, newDetail]);
    setFoundCattle(null);
    setCattleSearch('');
    setWeightInput('');
  }

  // Remove cattle from details
  function handleRemoveCattle(cattleId: string) {
    setDetails((prev) => prev.filter((d) => d.cattleId !== cattleId));
  }

  // Toggle tracker removed
  function handleToggleTracker(cattleId: string) {
    setDetails((prev) =>
      prev.map((d) =>
        d.cattleId === cattleId ? { ...d, trackerRemoved: !d.trackerRemoved } : d,
      ),
    );
  }

  // Submit sale
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!buyerId || !transactionDate || details.length === 0) {
      setError('Seleccione un comprador, fecha y al menos un animal.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        transactionDate: new Date(transactionDate).toISOString(),
        buyerId,
        transporterId: transporterId || undefined,
        minWeightConfig,
        valuePerKgConfig,
        totalAnimalCount,
        totalWeightKg,
        totalAmount,
        notes: notes || undefined,
        details: details.map((d) => ({
          cattleId: d.cattleId,
          cattleNumber: d.cattleNumber,
          measuredWeight: d.measuredWeight,
          isApproved: d.isApproved,
          rejectionReason: d.isApproved ? undefined : 'Peso por debajo del mínimo',
          trackerRemoved: d.trackerRemoved,
          calculatedPrice: d.calculatedPrice,
        })),
      };
      await apiFetch('/sales', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      router.push('/sales');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la venta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Link href="/sales" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Ventas
      </Link>
      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-6">
        Nueva Venta
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Configuration Section ── */}
        <Card>
          <h2 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-4">
            Configuraci&oacute;n de Venta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Comprador"
              options={buyerOptions}
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              required
              placeholder={loadingProviders ? 'Cargando...' : 'Seleccione comprador'}
              disabled={loadingProviders}
            />
            <Select
              label="Transportista"
              options={transporterOptions}
              value={transporterId}
              onChange={(e) => setTransporterId(e.target.value)}
              placeholder={loadingProviders ? 'Cargando...' : 'Opcional'}
              disabled={loadingProviders}
            />
            <Input
              label="Fecha de Venta"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
            <Input
              label="Peso M&iacute;nimo (kg)"
              type="number"
              value={minWeightConfig || ''}
              onChange={(e) => setMinWeightConfig(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min={0}
              step="0.1"
            />
            <Input
              label="Precio por Kg ($)"
              type="number"
              value={valuePerKgConfig || ''}
              onChange={(e) => setValuePerKgConfig(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min={0}
              step="1"
            />
          </div>
        </Card>

        {/* ── Cattle Selection Section ── */}
        <Card>
          <h2 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-4">
            Selecci&oacute;n de Animales
          </h2>

          {/* Search row */}
          <div className="flex gap-3 items-end mb-4">
            <div className="flex-1">
              <Input
                label="N&uacute;mero de Animal"
                type="text"
                value={cattleSearch}
                onChange={(e) => setCattleSearch(e.target.value)}
                placeholder="Ej: 0042"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchCattle();
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSearchCattle}
              disabled={searchingCattle || !cattleSearch.trim()}
            >
              {searchingCattle ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {cattleError && (
            <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">
              {cattleError}
            </div>
          )}

          {/* Found cattle - prompt for weight */}
          {foundCattle && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4">
              <p className="text-sm text-on-surface mb-3">
                Animal encontrado: <strong>{foundCattle.number}</strong>
                {foundCattle.name ? ` — ${foundCattle.name}` : ''}
              </p>
              <div className="flex gap-3 items-end">
                <div className="flex-1" style={{ maxWidth: 200 }}>
                  <Input
                    label="Peso Medido (kg)"
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    placeholder="Peso en kg"
                    min={0}
                    step="0.1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCattle();
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddCattle}
                  disabled={!weightInput || parseFloat(weightInput) <= 0}
                >
                  Agregar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFoundCattle(null);
                    setCattleSearch('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Cattle table */}
          {details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      N&uacute;mero
                    </th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      Peso (kg)
                    </th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      Precio Calc.
                    </th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      Aprobado
                    </th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      Tracker
                    </th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                      Quitar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d) => (
                    <tr key={d.cattleId} className="border-b border-border-light">
                      <td className="py-2.5 px-2 text-on-surface font-medium">
                        {d.cattleNumber}
                      </td>
                      <td className="py-2.5 px-2 text-right text-on-surface">
                        {d.measuredWeight.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-on-surface">
                        {formatCOP(d.calculatedPrice)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <Badge
                          label={d.isApproved ? 'S\u00ed' : 'No'}
                          variant={d.isApproved ? 'success' : 'error'}
                        />
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={d.trackerRemoved}
                          onChange={() => handleToggleTracker(d.cattleId)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveCattle(d.cattleId)}
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-on-surface-muted text-center py-6">
              No hay animales agregados. Busque por n&uacute;mero para comenzar.
            </p>
          )}
        </Card>

        {/* ── Financial Summary ── */}
        <Card className="!bg-success/10 !border-success/30">
          <h2 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-4">
            Resumen Financiero
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                Total Animales
              </p>
              <p className="text-2xl font-bold text-on-surface">{totalAnimalCount}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                Peso Total
              </p>
              <p className="text-2xl font-bold text-on-surface">
                {totalWeightKg.toFixed(1)} kg
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                Monto Total
              </p>
              <p className="text-2xl font-bold text-success">{formatCOP(totalAmount)}</p>
            </div>
          </div>
        </Card>

        {/* ── Notes ── */}
        <Card>
          <div>
            <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Observaciones adicionales..."
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface placeholder:text-on-surface-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              style={{ resize: 'vertical' }}
            />
          </div>
        </Card>

        {/* ── Submit ── */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={submitting || !buyerId || !transactionDate || details.length === 0}
          >
            {submitting ? 'Guardando...' : 'Crear Venta'}
          </Button>
        </div>
      </form>
    </div>
  );
}
