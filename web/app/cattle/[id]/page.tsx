'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

interface WeightRecord {
  id?: number | string;
  weight: number;
  date?: string;
  createdAt?: string;
}

interface MedicationRecord {
  id?: number | string;
  name?: string;
  medication?: string;
  date?: string;
  createdAt?: string;
  dose?: string;
  notes?: string;
}

interface CattleDetail {
  id: number | string;
  number?: string;
  receivedWeight?: number;
  lastWeight?: number;
  purchaseWeight?: number;
  status?: string;
  color?: string;
  gender?: string;
  castrated?: boolean;
  brand?: string;
  comments?: string;
  hasHorn?: boolean;
  eartagLeft?: string;
  eartagRight?: string;
  birthDateAprx?: string;
  weightHistory?: WeightRecord[];
  weights?: WeightRecord[];
  medicationHistory?: MedicationRecord[];
  medications?: MedicationRecord[];
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo', sold: 'Vendido', deceased: 'Fallecido',
  ACTIVE: 'Activo', SOLD: 'Vendido', DECEASED: 'Fallecido',
};

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Macho', FEMALE: 'Hembra', male: 'Macho', female: 'Hembra',
};

export default function CattleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [cattle, setCattle] = useState<CattleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await apiFetch<CattleDetail>(`/cattle/${id}`);
        setCattle(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'Manrope', sans-serif", color: '#9ca3af' }}>
        Cargando...
      </div>
    );
  }

  if (error || !cattle) {
    return (
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        <Link href="/cattle" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Volver a Ganado
        </Link>
        <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error || 'No se encontró el registro'}</p>
      </div>
    );
  }

  const infoFields: { label: string; value: React.ReactNode }[] = [
    { label: 'Número', value: cattle.number ?? '—' },
    { label: 'Peso Recibido', value: cattle.receivedWeight != null ? `${cattle.receivedWeight} kg` : '—' },
    { label: 'Peso Actual', value: cattle.lastWeight != null ? `${cattle.lastWeight} kg` : '—' },
    { label: 'Estado', value: STATUS_LABELS[cattle.status ?? ''] ?? cattle.status ?? '—' },
    { label: 'Color', value: cattle.color ?? '—' },
    { label: 'Género', value: GENDER_LABELS[cattle.gender ?? ''] ?? cattle.gender ?? '—' },
    { label: 'Castrado', value: cattle.castrated ? 'Sí' : 'No' },
    { label: 'Marca', value: cattle.brand ?? '—' },
    { label: 'Arete Izquierdo', value: cattle.eartagLeft ?? '—' },
    { label: 'Arete Derecho', value: cattle.eartagRight ?? '—' },
    { label: 'Fecha Nacimiento Aprox.', value: cattle.birthDateAprx ?? '—' },
    { label: 'Comentarios', value: cattle.comments ?? '—' },
  ];

  const weights = cattle.weightHistory ?? cattle.weights ?? [];
  const medications = cattle.medicationHistory ?? cattle.medications ?? [];

  const sectionHeading: React.CSSProperties = {
    fontFamily: "'Noto Serif', serif",
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'var(--foreground)',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
      <Link href="/cattle" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
        ← Volver a Ganado
      </Link>

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{
          fontFamily: "'Noto Serif', serif",
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--foreground)',
        }}>
          Animal #{cattle.number ?? id}
        </h1>
        <Link href={`/cattle/${id}/edit`} style={{
          padding: '0.5rem 1.25rem',
          background: '#16a34a',
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
          textDecoration: 'none',
        }}>
          Editar
        </Link>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        background: 'var(--background, #fff)',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        marginBottom: '2rem',
      }}>
        {infoFields.map((f) => (
          <div key={f.label}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, marginBottom: '0.125rem' }}>
              {f.label}
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--foreground)' }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {/* Weight History */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={sectionHeading}>Historial de Peso</h2>
        {weights.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sin registros de peso</p>
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600 }}>Fecha</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600 }}>Peso</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((w, idx) => (
                  <tr key={w.id ?? idx} style={{ background: idx % 2 === 0 ? 'var(--background, #fff)' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.5rem 1rem' }}>{w.date ?? w.createdAt ?? '—'}</td>
                    <td style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>{w.weight} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Medication History */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={sectionHeading}>Historial de Medicamentos</h2>
        {medications.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sin registros de medicamentos</p>
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600 }}>Fecha</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600 }}>Medicamento</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600 }}>Dosis</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600 }}>Notas</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((m, idx) => (
                  <tr key={m.id ?? idx} style={{ background: idx % 2 === 0 ? 'var(--background, #fff)' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.5rem 1rem' }}>{m.date ?? m.createdAt ?? '—'}</td>
                    <td style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>{m.name ?? m.medication ?? '—'}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>{m.dose ?? '—'}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>{m.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
