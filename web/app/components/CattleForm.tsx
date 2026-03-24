'use client';

import { useState, FormEvent } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';

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

const COLOR_OPTIONS = ['', 'Negro', 'Blanco', 'Café', 'Rojo', 'Amarillo', 'Pinto', 'Gris', 'Otro'];
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
  /** When provided, the form acts as edit mode. */
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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Manrope', sans-serif",
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.25rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: "'Manrope', sans-serif",
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    outline: 'none',
    background: 'var(--background, #fff)',
    color: 'var(--foreground, #111)',
    boxSizing: 'border-box',
  };

  const fieldWrap: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          color: '#991b1b',
          fontSize: '0.875rem',
          fontFamily: "'Manrope', sans-serif",
          marginBottom: '1.25rem',
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {/* Number */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Número *</label>
          <input
            type="text"
            value={form.number}
            onChange={(e) => set('number', e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Received Weight */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Peso Recibido (kg)</label>
          <input
            type="number"
            step="0.01"
            value={form.receivedWeight}
            onChange={(e) => set('receivedWeight', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Purchase Weight */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Peso de Compra (kg)</label>
          <input
            type="number"
            step="0.01"
            value={form.purchaseWeight}
            onChange={(e) => set('purchaseWeight', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Purchase Price */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Precio de Compra</label>
          <input
            type="number"
            step="0.01"
            value={form.purchasePrice}
            onChange={(e) => set('purchasePrice', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Last Weight */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Último Peso (kg)</label>
          <input
            type="number"
            step="0.01"
            value={form.lastWeight}
            onChange={(e) => set('lastWeight', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Color */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Color</label>
          <select
            value={form.color}
            onChange={(e) => set('color', e.target.value)}
            style={inputStyle}
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>{c || 'Seleccionar...'}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Género *</label>
          <select
            value={form.gender}
            onChange={(e) => set('gender', e.target.value)}
            style={inputStyle}
            required
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Estado</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            style={inputStyle}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Birth date */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Fecha Nacimiento Aprox.</label>
          <input
            type="date"
            value={form.birthDateAprx}
            onChange={(e) => set('birthDateAprx', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Eartag Left */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Arete Izquierdo</label>
          <input
            type="text"
            value={form.eartagLeft}
            onChange={(e) => set('eartagLeft', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Eartag Right */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Arete Derecho</label>
          <input
            type="text"
            value={form.eartagRight}
            onChange={(e) => set('eartagRight', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Manrope', sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.castrated}
            onChange={(e) => set('castrated', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#16a34a' }}
          />
          Castrado
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Manrope', sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.hasHorn}
            onChange={(e) => set('hasHorn', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#16a34a' }}
          />
          Tiene Cuernos
        </label>
      </div>

      {/* Comments */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Comentarios</label>
        <textarea
          value={form.comments}
          onChange={(e) => set('comments', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.625rem 1.5rem',
            background: submitting ? '#86efac' : '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: submitting ? 'default' : 'pointer',
          }}
        >
          {submitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Animal'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '0.625rem 1.5rem',
            background: 'var(--background, #fff)',
            color: 'var(--foreground, #111)',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
