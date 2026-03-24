'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const EVENT_TYPES = [
  { value: 'peso', label: 'Peso' },
  { value: 'caravana', label: 'Caravana' },
  { value: 'tracker', label: 'Tracker' },
  { value: 'hierro', label: 'Hierro' },
  { value: 'castracion', label: 'Castración' },
  { value: 'medicamento', label: 'Medicamento' },
];

export default function EventApplyPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [eventType, setEventType] = useState('peso');
  const [cattleNumber, setCattleNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dynamic fields based on event type
  const [peso, setPeso] = useState('');
  const [caravanaNumero, setCaravanaNumero] = useState('');
  const [trackerCode, setTrackerCode] = useState('');
  const [hierroId, setHierroId] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [dosis, setDosis] = useState('');
  const [notas, setNotas] = useState('');

  function buildPayload() {
    const base: Record<string, unknown> = {
      type: eventType,
      massiveEventId: Number(eventId),
      notes: notas || undefined,
    };

    switch (eventType) {
      case 'peso':
        base.weight = Number(peso);
        break;
      case 'caravana':
        base.tagNumber = caravanaNumero;
        break;
      case 'tracker':
        base.trackerCode = trackerCode;
        break;
      case 'hierro':
        base.brandId = hierroId ? Number(hierroId) : undefined;
        break;
      case 'castracion':
        // No additional fields needed beyond notes
        break;
      case 'medicamento':
        base.medication = medicamento;
        base.dosage = dosis;
        break;
    }

    return base;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cattleNumber.trim()) {
      setError('Ingrese el número del animal');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiFetch(`/cattle/apply-events/${cattleNumber.trim()}`, {
        method: 'POST',
        body: JSON.stringify(buildPayload()),
      });
      setSuccess(`Evento "${EVENT_TYPES.find(t => t.value === eventType)?.label}" aplicado correctamente al animal ${cattleNumber}`);
      // Reset form fields but keep event type and massive event context
      setCattleNumber('');
      setPeso('');
      setCaravanaNumero('');
      setTrackerCode('');
      setHierroId('');
      setMedicamento('');
      setDosis('');
      setNotas('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al aplicar evento');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setCattleNumber('');
    setPeso('');
    setCaravanaNumero('');
    setTrackerCode('');
    setHierroId('');
    setMedicamento('');
    setDosis('');
    setNotas('');
    setError('');
    setSuccess('');
  }

  return (
    <div className="font-body" style={{ maxWidth: 700, margin: '0 auto' }}>
      <Link href={`/events/${eventId}`} className="text-primary no-underline font-semibold text-sm">
        &larr; Volver al Evento
      </Link>

      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-2">
        Aplicar Evento a Ganado
      </h1>
      <p className="text-on-surface-muted mt-0 mb-6 text-sm">
        Registre un evento simple para un animal dentro del evento masivo #{eventId}
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Event Type */}
          <Select
            label="Tipo de Evento"
            options={EVENT_TYPES}
            value={eventType}
            onChange={(e) => { setEventType(e.target.value); resetForm(); }}
            required
          />

          {/* Cattle Number */}
          <Input
            label="Número de Animal"
            value={cattleNumber}
            onChange={(e) => setCattleNumber(e.target.value)}
            placeholder="Ej: 001, A-123"
            required
          />

          {/* Dynamic fields based on event type */}
          {eventType === 'peso' && (
            <Input
              label="Peso (kg)"
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ej: 350"
              required
            />
          )}

          {eventType === 'caravana' && (
            <Input
              label="Número de Caravana"
              value={caravanaNumero}
              onChange={(e) => setCaravanaNumero(e.target.value)}
              placeholder="Ej: CAR-0001"
              required
            />
          )}

          {eventType === 'tracker' && (
            <Input
              label="Código de Tracker"
              value={trackerCode}
              onChange={(e) => setTrackerCode(e.target.value)}
              placeholder="Ej: TRK-00001"
              required
            />
          )}

          {eventType === 'hierro' && (
            <Input
              label="ID del Hierro"
              value={hierroId}
              onChange={(e) => setHierroId(e.target.value)}
              placeholder="Ej: 1"
              required
            />
          )}

          {eventType === 'castracion' && (
            <div className="bg-info/10 border border-info/30 text-info rounded-lg px-4 py-3 text-sm">
              No se requieren campos adicionales para castración. Puede agregar notas abajo.
            </div>
          )}

          {eventType === 'medicamento' && (
            <>
              <Input
                label="Medicamento"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
                placeholder="Nombre del medicamento"
                required
              />
              <Input
                label="Dosis"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                placeholder="Ej: 5ml, 2 tabletas"
                required
              />
            </>
          )}

          {/* Notes - always visible */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
              Notas (Opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              style={{ resize: 'vertical' }}
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-sm">{success}</div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Aplicando...' : 'Aplicar Evento'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push(`/events/${eventId}`)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
