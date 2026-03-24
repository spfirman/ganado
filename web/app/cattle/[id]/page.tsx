'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';

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
      <div className="p-8 text-center font-body text-on-surface-muted">
        Cargando...
      </div>
    );
  }

  if (error || !cattle) {
    return (
      <div className="font-body" style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/cattle" className="text-primary no-underline text-sm">
          ← Volver a Ganado
        </Link>
        <p className="text-error mt-4">{error || 'No se encontró el registro'}</p>
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

  return (
    <div className="font-body" style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link href="/cattle" className="text-primary no-underline text-sm font-medium">
        ← Volver a Ganado
      </Link>

      {/* Title */}
      <div className="flex justify-between items-center mt-4 mb-6 flex-wrap gap-3">
        <h1 className="font-heading text-2xl font-bold text-on-surface m-0">
          Animal #{cattle.number ?? id}
        </h1>
        <Link href={`/cattle/${id}/edit`} className="no-underline">
          <Button>Editar</Button>
        </Link>
      </div>

      {/* Info Grid */}
      <Card className="mb-8">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {infoFields.map((f) => (
            <div key={f.label}>
              <div className="text-xs text-on-surface-muted font-medium mb-0.5">
                {f.label}
              </div>
              <div className="text-[0.9375rem] font-semibold text-on-surface">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weight History */}
      <div className="mb-8">
        <h2 className="font-heading text-lg font-semibold text-on-surface mb-3">Historial de Peso</h2>
        {weights.length === 0 ? (
          <p className="text-on-surface-muted text-sm">Sin registros de peso</p>
        ) : (
          <DataTable
            columns={[
              { key: 'date', label: 'Fecha', render: (w: WeightRecord) => w.date ?? w.createdAt ?? '—' },
              { key: 'weight', label: 'Peso', render: (w: WeightRecord) => <span className="font-semibold">{w.weight} kg</span> },
            ]}
            data={weights}
          />
        )}
      </div>

      {/* Medication History */}
      <div className="mb-8">
        <h2 className="font-heading text-lg font-semibold text-on-surface mb-3">Historial de Medicamentos</h2>
        {medications.length === 0 ? (
          <p className="text-on-surface-muted text-sm">Sin registros de medicamentos</p>
        ) : (
          <DataTable
            columns={[
              { key: 'date', label: 'Fecha', render: (m: MedicationRecord) => m.date ?? m.createdAt ?? '—' },
              { key: 'name', label: 'Medicamento', render: (m: MedicationRecord) => <span className="font-semibold">{m.name ?? m.medication ?? '—'}</span> },
              { key: 'dose', label: 'Dosis', render: (m: MedicationRecord) => m.dose ?? '—' },
              { key: 'notes', label: 'Notas', render: (m: MedicationRecord) => m.notes ?? '—' },
            ]}
            data={medications}
          />
        )}
      </div>
    </div>
  );
}
