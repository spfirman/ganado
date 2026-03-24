'use client';

import { useState, FormEvent } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

export interface CattleFormData {
  number: string;
  receivedWeight: string;
  purchaseWeight: string;
  purchasePrice: string;
  lastWeight: string;
  color: string;
  gender: string;
  status: string;
  comments: string;
  castrated: boolean;
  hasHorn: boolean;
  birthDateAprx: string;
  eartagLeft: string;
  eartagRight: string;
}

const EMPTY_FORM: CattleFormData = {
  number: '',
  receivedWeight: '',
  purchaseWeight: '',
  purchasePrice: '',
  lastWeight: '',
  color: '',
  gender: '',
  status: 'active',
  comments: '',
  castrated: false,
  hasHorn: false,
  birthDateAprx: '',
  eartagLeft: '',
  eartagRight: '',
};

const COLOR_OPTIONS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'Negro', label: 'Negro' },
  { value: 'Blanco', label: 'Blanco' },
  { value: 'Café', label: 'Café' },
  { value: 'Rojo', label: 'Rojo' },
  { value: 'Amarillo', label: 'Amarillo' },
  { value: 'Pinto', label: 'Pinto' },
  { value: 'Gris', label: 'Gris' },
  { value: 'Otro', label: 'Otro' },
];
const GENDER_OPTIONS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'MALE', label: 'Macho' },
  { value: 'FEMALE', label: 'Hembra' },
];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'sold', label: 'Vendido' },
  { value: 'deceased', label: 'Fallecido' },
];

interface CattleFormProps {
  cattleId?: string;
  initialData?: Partial<CattleFormData>;
}

export default function CattleForm({ cattleId, initialData }: CattleFormProps) {
  const router = useRouter();
  const isEdit = Boolean(cattleId);

  const [form, setForm] = useState<CattleFormData>(() => ({
    ...EMPTY_FORM,
    ...initialData,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof CattleFormData>(key: K, value: CattleFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.number.trim()) {
      setError('El número es obligatorio');
      return;
    }
    if (!form.gender) {
      setError('El género es obligatorio');
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        number: form.number.trim(),
        color: form.color || undefined,
        gender: form.gender,
        status: form.status,
        comments: form.comments || undefined,
        castrated: form.castrated,
        hasHorn: form.hasHorn,
        eartagLeft: form.eartagLeft || undefined,
        eartagRight: form.eartagRight || undefined,
        birthDateAprx: form.birthDateAprx || undefined,
      };

      if (form.receivedWeight) body.receivedWeight = parseFloat(form.receivedWeight);
      if (form.purchaseWeight) body.purchaseWeight = parseFloat(form.purchaseWeight);
      if (form.purchasePrice) body.purchasePrice = parseFloat(form.purchasePrice);
      if (form.lastWeight) body.lastWeight = parseFloat(form.lastWeight);

      if (isEdit) {
        await apiFetch(`/cattle/${cattleId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
        router.push(`/cattle/${cattleId}`);
      } else {
        await apiFetch('/cattle', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        router.push('/cattle');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-error/10 border border-error/30 rounded-lg px-4 py-3 text-error text-sm font-body mb-5">
          {error}
        </div>
      )}

      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <Input
          label="Número *"
          type="text"
          value={form.number}
          onChange={(e) => set('number', e.target.value)}
          required
        />
        <Input
          label="Peso Recibido (kg)"
          type="number"
          step="0.01"
          value={form.receivedWeight}
          onChange={(e) => set('receivedWeight', e.target.value)}
        />
        <Input
          label="Peso de Compra (kg)"
          type="number"
          step="0.01"
          value={form.purchaseWeight}
          onChange={(e) => set('purchaseWeight', e.target.value)}
        />
        <Input
          label="Precio de Compra"
          type="number"
          step="0.01"
          value={form.purchasePrice}
          onChange={(e) => set('purchasePrice', e.target.value)}
        />
        <Input
          label="Último Peso (kg)"
          type="number"
          step="0.01"
          value={form.lastWeight}
          onChange={(e) => set('lastWeight', e.target.value)}
        />
        <Select
          label="Color"
          options={COLOR_OPTIONS}
          value={form.color}
          onChange={(e) => set('color', e.target.value)}
        />
        <Select
          label="Género *"
          options={GENDER_OPTIONS}
          value={form.gender}
          onChange={(e) => set('gender', e.target.value)}
          required
        />
        <Select
          label="Estado"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={(e) => set('status', e.target.value)}
        />
        <Input
          label="Fecha Nacimiento Aprox."
          type="date"
          value={form.birthDateAprx}
          onChange={(e) => set('birthDateAprx', e.target.value)}
        />
        <Input
          label="Arete Izquierdo"
          type="text"
          value={form.eartagLeft}
          onChange={(e) => set('eartagLeft', e.target.value)}
        />
        <Input
          label="Arete Derecho"
          type="text"
          value={form.eartagRight}
          onChange={(e) => set('eartagRight', e.target.value)}
        />
      </div>

      {/* Checkboxes */}
      <div className="flex gap-8 mb-5 flex-wrap">
        <label className="flex items-center gap-2 font-body text-sm font-medium text-on-surface cursor-pointer">
          <input
            type="checkbox"
            checked={form.castrated}
            onChange={(e) => set('castrated', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Castrado
        </label>
        <label className="flex items-center gap-2 font-body text-sm font-medium text-on-surface cursor-pointer">
          <input
            type="checkbox"
            checked={form.hasHorn}
            onChange={(e) => set('hasHorn', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Tiene Cuernos
        </label>
      </div>

      {/* Comments */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Comentarios</label>
        <textarea
          value={form.comments}
          onChange={(e) => set('comments', e.target.value)}
          rows={3}
          className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Animal'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
