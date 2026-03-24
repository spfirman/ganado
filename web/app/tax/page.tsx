'use client';

import { useState } from 'react';
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// TODO: connect to /api/v1/tax/* endpoints when available

interface TaxDocument {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  estado: 'LISTO' | 'PENDIENTE' | 'EXPORTADO';
}

interface TaxAllocation {
  categoria: string;
  monto: number;
  porcentaje: number;
}

interface RecentTransaction {
  id: number;
  descripcion: string;
  fecha: string;
  monto: number;
  tipo: 'ingreso' | 'egreso';
}

const mockDocuments: TaxDocument[] = [
  { id: 1, nombre: 'Declaración IVA Q1 2026', tipo: 'IVA', fecha: '2026-03-15', estado: 'LISTO' },
  { id: 2, nombre: 'Retención en la Fuente - Febrero', tipo: 'Retención', fecha: '2026-03-01', estado: 'EXPORTADO' },
  { id: 3, nombre: 'Factura Venta Lote #45', tipo: 'Factura', fecha: '2026-02-28', estado: 'LISTO' },
  { id: 4, nombre: 'Declaración Renta 2025', tipo: 'Renta', fecha: '2026-03-31', estado: 'PENDIENTE' },
  { id: 5, nombre: 'Certificado Retención Proveedor', tipo: 'Certificado', fecha: '2026-02-15', estado: 'PENDIENTE' },
  { id: 6, nombre: 'ICA Trimestral', tipo: 'ICA', fecha: '2026-01-30', estado: 'EXPORTADO' },
];

const mockAllocations: TaxAllocation[] = [
  { categoria: 'IVA sobre Ventas', monto: 12500000, porcentaje: 42 },
  { categoria: 'Retención en la Fuente', monto: 8300000, porcentaje: 28 },
  { categoria: 'ICA Municipal', monto: 4200000, porcentaje: 14 },
  { categoria: 'Impuesto de Renta (Estimado)', monto: 4800000, porcentaje: 16 },
];

const mockTransactions: RecentTransaction[] = [
  { id: 1, descripcion: 'Venta de 30 novillos - Finca La Esperanza', fecha: '2026-03-20', monto: 45000000, tipo: 'ingreso' },
  { id: 2, descripcion: 'Compra de suplementos veterinarios', fecha: '2026-03-18', monto: 3200000, tipo: 'egreso' },
  { id: 3, descripcion: 'Venta de 15 vacas descarte', fecha: '2026-03-12', monto: 18000000, tipo: 'ingreso' },
  { id: 4, descripcion: 'Pago servicios de transporte', fecha: '2026-03-10', monto: 1500000, tipo: 'egreso' },
  { id: 5, descripcion: 'Venta de leche mensual', fecha: '2026-03-05', monto: 8500000, tipo: 'ingreso' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'info'> = {
  LISTO: 'success',
  PENDIENTE: 'warning',
  EXPORTADO: 'info',
};

export default function TaxPage() {
  const [filter, setFilter] = useState<'todos' | 'LISTO' | 'PENDIENTE' | 'EXPORTADO'>('todos');

  const filteredDocs = filter === 'todos'
    ? mockDocuments
    : mockDocuments.filter(d => d.estado === filter);

  const docColumns = [
    { key: 'nombre', label: 'Documento', render: (d: TaxDocument) => <span className="font-semibold">{d.nombre}</span> },
    { key: 'tipo', label: 'Tipo' },
    { key: 'fecha', label: 'Fecha', render: (d: TaxDocument) => new Date(d.fecha).toLocaleDateString('es-CO') },
    { key: 'estado', label: 'Estado', render: (d: TaxDocument) => (
      <Badge label={d.estado} variant={statusVariant[d.estado]} />
    )},
  ];

  const txColumns = [
    { key: 'descripcion', label: 'Descripción', render: (t: RecentTransaction) => <span className="font-semibold">{t.descripcion}</span> },
    { key: 'fecha', label: 'Fecha', render: (t: RecentTransaction) => new Date(t.fecha).toLocaleDateString('es-CO') },
    { key: 'monto', label: 'Monto', render: (t: RecentTransaction) => (
      <span className={t.tipo === 'ingreso' ? 'text-success font-semibold' : 'text-error font-semibold'}>
        {t.tipo === 'ingreso' ? '+' : '-'} COP ${t.monto.toLocaleString()}
      </span>
    )},
    { key: 'tipo', label: 'Tipo', render: (t: RecentTransaction) => (
      <Badge label={t.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} variant={t.tipo === 'ingreso' ? 'success' : 'error'} />
    )},
  ];

  return (
    <div className="font-body" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Impuestos</h1>
          <p className="text-on-surface-muted mt-1 mb-0 text-sm">Automatización de documentos tributarios y resumen fiscal</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">Subir Documento</Button>
          <Button>Automatizar Presentación</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        <KPICard
          title="Responsabilidad Tributaria Estimada"
          value="COP $29.800.000"
          delta="Período fiscal 2026"
          bgVariant="alert"
        />
        <KPICard
          title="Ventas Gravables YTD"
          value="COP $71.500.000"
          delta="+12% vs. mismo período 2025"
          bgVariant="positive"
        />
        <KPICard
          title="Preparación de Deducciones"
          value="68%"
          delta="4 documentos pendientes"
          bgVariant="neutral"
        />
      </div>

      {/* Document Queue */}
      <Card className="mb-8" padding="none">
        <div className="px-5 pt-5 pb-4">
          <h2 className="text-lg font-bold text-on-surface m-0 mb-3">Cola de Documentos</h2>
          <div className="flex gap-2 flex-wrap">
            {(['todos', 'LISTO', 'PENDIENTE', 'EXPORTADO'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer border ${
                  filter === f
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface text-on-surface-muted border-border hover:bg-surface-alt'
                }`}
              >
                {f === 'todos' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>
        <DataTable columns={docColumns} data={filteredDocs} emptyMessage="No hay documentos en esta categoría" />
      </Card>

      {/* Tax Allocation Breakdown */}
      <Card className="mb-8">
        <h2 className="text-lg font-bold text-on-surface m-0 mb-4">Desglose de Asignación Tributaria</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {mockAllocations.map((a) => (
            <div key={a.categoria} className="border border-border-light rounded-lg p-4">
              <div className="text-xs text-on-surface-muted font-semibold uppercase">{a.categoria}</div>
              <div className="text-xl font-bold text-on-surface mt-1">COP ${a.monto.toLocaleString()}</div>
              <div className="mt-2 w-full bg-surface rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${a.porcentaje}%` }} />
              </div>
              <div className="text-xs text-on-surface-muted mt-1">{a.porcentaje}% del total</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card padding="none">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-on-surface m-0">Transacciones Recientes</h2>
        </div>
        <DataTable columns={txColumns} data={mockTransactions} emptyMessage="No hay transacciones recientes" />
      </Card>
    </div>
  );
}
