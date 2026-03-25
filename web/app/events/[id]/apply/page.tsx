'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SimpleEvent {
  id: string;
  type: string;
  isActive: boolean;
  data: Record<string, unknown>;
  createdAt: string;
}

interface ProcessLogEntry {
  cattleNumber: string;
  timestamp: Date;
  eventsApplied: number;
  success: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EVENT_TYPES = [
  { value: 'weight', label: 'Peso' },
  { value: 'eartag', label: 'Caravana' },
  { value: 'tracker', label: 'Tracker' },
  { value: 'brand', label: 'Hierro' },
  { value: 'castration', label: 'Castración' },
  { value: 'medication', label: 'Medicamento' },
];

const TYPE_LABELS: Record<string, string> = {
  weight: 'Peso',
  eartag: 'Caravana',
  tracker: 'Tracker',
  brand: 'Hierro',
  castration: 'Castración',
  medication: 'Medicamento',
};

const TYPE_BADGE_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  weight: 'info',
  eartag: 'success',
  tracker: 'warning',
  brand: 'neutral',
  castration: 'error',
  medication: 'success',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function describeEvent(evt: SimpleEvent): string {
  const d = evt.data || {};
  switch (evt.type) {
    case 'weight':
      return d.weight ? `${d.weight} kg` : 'Peso';
    case 'eartag':
      return (d.eartagNumber as string) || (d.tagNumber as string) || 'Caravana';
    case 'tracker':
      return (d.trackerCode as string) || 'Tracker';
    case 'brand':
      return (d.brandId as string) || (d.brandName as string) || 'Hierro';
    case 'castration':
      return 'Castración';
    case 'medication':
      return (d.medicationName as string) || (d.medication as string) || 'Medicamento';
    default:
      return evt.type;
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventApplyPage() {
  const params = useParams();
  const eventId = params.id as string;
  const cattleInputRef = useRef<HTMLInputElement>(null);

  // --- Simple events state ---
  const [simpleEvents, setSimpleEvents] = useState<SimpleEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // --- Add event form ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState('weight');
  const [newData, setNewData] = useState<Record<string, string>>({});
  const [addingEvent, setAddingEvent] = useState(false);
  const [addError, setAddError] = useState('');

  // --- Processing state ---
  const [cattleNumber, setCattleNumber] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [processLog, setProcessLog] = useState<ProcessLogEntry[]>([]);

  // --- Fetch simple events ---
  const fetchSimpleEvents = useCallback(async () => {
    try {
      setEventsError('');
      const data = await apiFetch<SimpleEvent[]>(`/simple-events/by-massive-event/${eventId}`);
      setSimpleEvents(data);
    } catch (err: unknown) {
      setEventsError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoadingEvents(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSimpleEvents();
  }, [fetchSimpleEvents]);

  // --- Toggle active state ---
  async function handleToggle(evt: SimpleEvent) {
    const newActive = !evt.isActive;
    // Optimistic update
    setSimpleEvents((prev) =>
      prev.map((e) => (e.id === evt.id ? { ...e, isActive: newActive } : e)),
    );
    try {
      await apiFetch(`/simple-events/${evt.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: newActive }),
      });
    } catch {
      // Revert on failure
      setSimpleEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, isActive: !newActive } : e)),
      );
    }
  }

  // --- Add new simple event ---
  function buildNewEventData(): Record<string, unknown> {
    switch (newType) {
      case 'weight':
        return { weight: Number(newData.weight) || 0 };
      case 'eartag':
        return { eartagNumber: newData.eartagNumber || '' };
      case 'tracker':
        return { trackerCode: newData.trackerCode || '' };
      case 'brand':
        return { brandName: newData.brandName || '' };
      case 'castration':
        return {};
      case 'medication':
        return {
          medicationName: newData.medicationName || '',
          dosage: newData.dosage || '',
          lot: newData.lot || '',
        };
      default:
        return {};
    }
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setAddingEvent(true);
    setAddError('');
    try {
      await apiFetch('/simple-events', {
        method: 'POST',
        body: JSON.stringify({
          idMassiveEvent: eventId,
          type: newType,
          data: buildNewEventData(),
        }),
      });
      setShowAddForm(false);
      setNewType('weight');
      setNewData({});
      await fetchSimpleEvents();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : 'Error al agregar evento');
    } finally {
      setAddingEvent(false);
    }
  }

  // --- Apply events to cattle ---
  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    const num = cattleNumber.trim();
    if (!num) {
      setApplyError('Ingrese el número del animal');
      return;
    }

    const activeEvents = simpleEvents.filter((ev) => ev.isActive);
    if (activeEvents.length === 0) {
      setApplyError('No hay eventos activos para aplicar');
      return;
    }

    setApplying(true);
    setApplyError('');
    setApplySuccess('');

    try {
      await apiFetch(`/cattle/apply-events/${num}`, {
        method: 'POST',
        body: JSON.stringify({
          applied: {
            idMassiveEvent: eventId,
            events: activeEvents.map((ev) => ({
              type: ev.type,
              data: ev.data,
              idSimpleEvent: ev.id,
            })),
          },
        }),
      });

      const entry: ProcessLogEntry = {
        cattleNumber: num,
        timestamp: new Date(),
        eventsApplied: activeEvents.length,
        success: true,
        message: `${activeEvents.length} evento(s) aplicado(s)`,
      };
      setProcessLog((prev) => [entry, ...prev]);
      setApplySuccess(`Animal ${num}: ${activeEvents.length} evento(s) aplicado(s) correctamente`);
      setCattleNumber('');
      // Refocus for rapid processing
      setTimeout(() => cattleInputRef.current?.focus(), 50);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aplicar eventos';
      const entry: ProcessLogEntry = {
        cattleNumber: num,
        timestamp: new Date(),
        eventsApplied: 0,
        success: false,
        message: msg,
      };
      setProcessLog((prev) => [entry, ...prev]);
      setApplyError(msg);
    } finally {
      setApplying(false);
    }
  }

  // --- Active count ---
  const activeCount = simpleEvents.filter((e) => e.isActive).length;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="font-body">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/events/${eventId}`} className="text-primary no-underline font-semibold text-sm">
          &larr; Volver al Evento
        </Link>
        <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-1">
          Estación de Procesamiento
        </h1>
        <p className="text-on-surface-muted mt-0 mb-0 text-sm">
          Evento masivo #{eventId} &mdash; {activeCount} evento(s) activo(s) en cola
        </p>
      </div>

      {/* Split panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* ================================================================= */}
        {/* LEFT PANEL - Event Queue                                          */}
        {/* ================================================================= */}
        <div className="flex flex-col gap-4">
          <Card padding="none" className="flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold text-on-surface m-0">Cola de Eventos</h2>
              <span className="text-xs text-on-surface-muted">
                {simpleEvents.length} total &middot; {activeCount} activo(s)
              </span>
            </div>

            {/* Event list */}
            <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 340px)', minHeight: 200 }}>
              {loadingEvents && (
                <div className="px-4 py-8 text-center text-on-surface-muted text-sm">Cargando eventos...</div>
              )}

              {eventsError && (
                <div className="px-4 py-4 text-error text-sm">{eventsError}</div>
              )}

              {!loadingEvents && !eventsError && simpleEvents.length === 0 && (
                <div className="px-4 py-8 text-center text-on-surface-muted text-sm">
                  No hay eventos configurados.<br />Agregue uno abajo.
                </div>
              )}

              {simpleEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`
                    flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 transition-all duration-150
                    ${evt.isActive ? 'border-l-[3px] border-l-success bg-success/5' : 'border-l-[3px] border-l-transparent opacity-50'}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <Badge
                      label={TYPE_LABELS[evt.type] || evt.type}
                      variant={TYPE_BADGE_VARIANT[evt.type] || 'neutral'}
                      className="mb-1"
                    />
                    <p className="text-sm text-on-surface m-0 truncate">{describeEvent(evt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle(evt)}
                    className={`
                      relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 border-0
                      ${evt.isActive ? 'bg-success' : 'bg-border'}
                    `}
                    aria-label={evt.isActive ? 'Desactivar' : 'Activar'}
                  >
                    <span
                      className={`
                        absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                        ${evt.isActive ? 'translate-x-5' : 'translate-x-0.5'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Add event section */}
            <div className="border-t border-border">
              {!showAddForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="w-full px-4 py-3 text-sm font-semibold text-primary bg-transparent border-0 cursor-pointer hover:bg-primary/5 transition-colors duration-150"
                >
                  + Agregar Evento
                </button>
              ) : (
                <form onSubmit={handleAddEvent} className="p-4 flex flex-col gap-3">
                  <Select
                    label="Tipo"
                    options={EVENT_TYPES}
                    value={newType}
                    onChange={(e) => { setNewType(e.target.value); setNewData({}); }}
                    required
                  />

                  {newType === 'weight' && (
                    <Input
                      label="Peso (kg)"
                      type="number"
                      value={newData.weight || ''}
                      onChange={(e) => setNewData({ ...newData, weight: e.target.value })}
                      placeholder="350"
                      required
                    />
                  )}

                  {newType === 'eartag' && (
                    <Input
                      label="Número de Caravana"
                      value={newData.eartagNumber || ''}
                      onChange={(e) => setNewData({ ...newData, eartagNumber: e.target.value })}
                      placeholder="CAR-0001"
                      required
                    />
                  )}

                  {newType === 'tracker' && (
                    <Input
                      label="Código de Tracker"
                      value={newData.trackerCode || ''}
                      onChange={(e) => setNewData({ ...newData, trackerCode: e.target.value })}
                      placeholder="TRK-00001"
                      required
                    />
                  )}

                  {newType === 'brand' && (
                    <Input
                      label="Nombre del Hierro"
                      value={newData.brandName || ''}
                      onChange={(e) => setNewData({ ...newData, brandName: e.target.value })}
                      placeholder="Hierro ABC"
                      required
                    />
                  )}

                  {newType === 'castration' && (
                    <div className="text-xs text-on-surface-muted py-1">
                      Sin campos adicionales.
                    </div>
                  )}

                  {newType === 'medication' && (
                    <>
                      <Input
                        label="Medicamento"
                        value={newData.medicationName || ''}
                        onChange={(e) => setNewData({ ...newData, medicationName: e.target.value })}
                        placeholder="Ivermectina"
                        required
                      />
                      <Input
                        label="Dosis"
                        value={newData.dosage || ''}
                        onChange={(e) => setNewData({ ...newData, dosage: e.target.value })}
                        placeholder="5ml"
                        required
                      />
                      <Input
                        label="Lote"
                        value={newData.lot || ''}
                        onChange={(e) => setNewData({ ...newData, lot: e.target.value })}
                        placeholder="LOT-001"
                      />
                    </>
                  )}

                  {addError && (
                    <div className="bg-error/10 text-error text-xs rounded px-3 py-2">{addError}</div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={addingEvent}>
                      {addingEvent ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setShowAddForm(false); setAddError(''); setNewData({}); }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* RIGHT PANEL - Animal Processing                                   */}
        {/* ================================================================= */}
        <div className="flex flex-col gap-4">
          {/* Processing card */}
          <Card>
            <h2 className="text-lg font-bold text-on-surface m-0 mb-4">Procesar Animal</h2>

            <form onSubmit={handleApply} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="cattle-number-input"
                  className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1"
                >
                  Número de Animal
                </label>
                <input
                  ref={cattleInputRef}
                  id="cattle-number-input"
                  type="text"
                  value={cattleNumber}
                  onChange={(e) => { setCattleNumber(e.target.value); setApplyError(''); setApplySuccess(''); }}
                  placeholder="Escanear o ingresar número..."
                  autoFocus
                  className="
                    w-full px-5 py-4 text-2xl font-bold rounded-lg border-2
                    bg-surface text-on-surface placeholder:text-on-surface-muted/40
                    outline-none transition-all duration-150
                    focus:border-primary focus:ring-4 focus:ring-primary/20
                    border-border
                  "
                />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" size="lg" disabled={applying || activeCount === 0}>
                  {applying ? 'Aplicando...' : `Aplicar ${activeCount} Evento(s)`}
                </Button>
                {activeCount === 0 && (
                  <span className="text-xs text-warning">No hay eventos activos</span>
                )}
              </div>

              {/* Feedback messages */}
              {applyError && (
                <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm">
                  {applyError}
                </div>
              )}
              {applySuccess && (
                <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-sm">
                  {applySuccess}
                </div>
              )}
            </form>

            {/* Active events summary */}
            {activeCount > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-2">
                  Eventos que se aplicarán
                </span>
                <div className="flex flex-wrap gap-2">
                  {simpleEvents
                    .filter((ev) => ev.isActive)
                    .map((ev) => (
                      <Badge
                        key={ev.id}
                        label={`${TYPE_LABELS[ev.type] || ev.type}: ${describeEvent(ev)}`}
                        variant={TYPE_BADGE_VARIANT[ev.type] || 'neutral'}
                      />
                    ))}
                </div>
              </div>
            )}
          </Card>

          {/* Processing log */}
          <Card padding="none">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-on-surface m-0">Registro de Procesamiento</h3>
              <span className="text-xs text-on-surface-muted">{processLog.length} animal(es) procesado(s)</span>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 350 }}>
              {processLog.length === 0 ? (
                <div className="px-5 py-8 text-center text-on-surface-muted text-sm">
                  Los animales procesados aparecerán aquí.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">Hora</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">Animal</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">Eventos</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processLog.map((entry, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface/50">
                        <td className="px-5 py-2.5 text-on-surface-muted whitespace-nowrap">{formatTime(entry.timestamp)}</td>
                        <td className="px-5 py-2.5 font-semibold text-on-surface">{entry.cattleNumber}</td>
                        <td className="px-5 py-2.5 text-on-surface-muted">{entry.eventsApplied}</td>
                        <td className="px-5 py-2.5">
                          <Badge
                            label={entry.success ? 'OK' : 'Error'}
                            variant={entry.success ? 'success' : 'error'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
