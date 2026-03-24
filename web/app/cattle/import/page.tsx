'use client';

import { useState, useRef } from 'react';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';

interface PreviewRow {
  number?: string;
  gender?: string;
  color?: string;
  receivedWeight?: number;
  status?: string;
  [key: string]: unknown;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
}

export default function CattleImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [previewColumns, setPreviewColumns] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const ext = selected.name.substring(selected.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(selected.type) && !validExtensions.includes(ext)) {
      setError('Formato no soportado. Use archivos CSV o Excel (.csv, .xls, .xlsx)');
      return;
    }

    setFile(selected);
    setErrors([]);
    setSuccess('');
    setError('');
    parsePreview(selected);
  }

  async function parsePreview(file: File) {
    setParsing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        setError('El archivo está vacío o no tiene datos');
        setParsing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      setPreviewColumns(headers);

      const rows: PreviewRow[] = [];
      for (let i = 1; i < Math.min(lines.length, 21); i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row: PreviewRow = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || '';
        });
        rows.push(row);
      }
      setPreviewData(rows);
    } catch {
      setError('Error al leer el archivo');
    } finally {
      setParsing(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    setError('');
    setSuccess('');
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch<{ imported?: number; errors?: ImportError[] }>('/cattle/import', {
        method: 'POST',
        body: formData,
        headers: {},
      });

      if (res.errors && res.errors.length > 0) {
        setErrors(res.errors);
      }
      setSuccess(`Se importaron ${res.imported ?? 0} animales correctamente.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al importar');
    } finally {
      setImporting(false);
    }
  }

  function handleReset() {
    setFile(null);
    setPreviewData([]);
    setPreviewColumns([]);
    setErrors([]);
    setSuccess('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const tableColumns = previewColumns.map(col => ({
    key: col,
    label: col,
    render: (row: PreviewRow) => <span>{String(row[col] ?? '')}</span>,
  }));

  return (
    <div className="font-body" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Link href="/cattle" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Ganado
      </Link>

      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-2">
        Importar Ganado
      </h1>
      <p className="text-on-surface-muted mt-0 mb-6 text-sm">
        Suba un archivo CSV o Excel para importar animales de forma masiva.
      </p>

      {/* Upload Area */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-on-surface m-0 mb-4">Seleccionar Archivo</h2>

        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-on-surface-muted mb-3 opacity-60">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-on-surface font-semibold m-0">
            {file ? file.name : 'Haga clic para seleccionar un archivo'}
          </p>
          <p className="text-on-surface-muted text-xs mt-1 m-0">
            Formatos soportados: CSV, XLS, XLSX
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {file && (
          <div className="flex gap-3 mt-4">
            <Button variant="ghost" onClick={handleReset}>Cambiar Archivo</Button>
          </div>
        )}
      </Card>

      {/* Messages */}
      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-sm mb-4">{success}</div>
      )}

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-error m-0 mb-3">Errores de Validación</h2>
          <div className="max-h-48 overflow-y-auto">
            {errors.map((err, i) => (
              <div key={i} className="flex gap-3 text-sm py-2 border-b border-border-light last:border-0">
                <span className="text-on-surface-muted font-mono text-xs">Fila {err.row}</span>
                <span className="text-on-surface-muted">{err.field}:</span>
                <span className="text-error">{err.message}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Table */}
      {previewData.length > 0 && (
        <Card padding="none" className="mb-6">
          <div className="px-5 pt-5 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-on-surface m-0">Vista Previa</h2>
              <p className="text-xs text-on-surface-muted mt-1 m-0">
                Mostrando las primeras {previewData.length} filas
              </p>
            </div>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Importando...' : 'Importar'}
            </Button>
          </div>
          <DataTable columns={tableColumns} data={previewData} loading={parsing} emptyMessage="Sin datos para previsualizar" />
        </Card>
      )}
    </div>
  );
}
