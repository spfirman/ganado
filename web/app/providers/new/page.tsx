'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const TYPES = [
  { value: 'PROVIDER', label: 'PROVIDER' },
  { value: 'BUYER', label: 'BUYER' },
  { value: 'TRANSPORTER', label: 'TRANSPORTER' },
  { value: 'VET', label: 'VET' },
  { value: 'OTHER', label: 'OTHER' },
];

export default function NewProviderPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nit, setNit] = useState('');
  const [type, setType] = useState('PROVIDER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiFetch('/providers', {
        method: 'POST',
        body: JSON.stringify({ name, nit, type }),
      });
      router.push('/providers');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el proveedor');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-body" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Link href="/providers" className="text-primary no-underline font-semibold text-sm">
        &larr; Volver a Proveedores
      </Link>
      <h1 className="font-heading text-3xl font-bold text-on-surface mt-4 mb-6">
        Nuevo Proveedor
      </h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input label="Nombre" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nombre del proveedor" />
          <Input label="NIT" type="text" value={nit} onChange={(e) => setNit(e.target.value)} placeholder="NIT" />
          <Select label="Tipo" options={TYPES} value={type} onChange={(e) => setType(e.target.value)} required />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Crear Proveedor'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
