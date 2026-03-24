'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const TYPES = [
  { value: 'PROVIDER', label: 'PROVIDER' },
  { value: 'BUYER', label: 'BUYER' },
  { value: 'TRANSPORTER', label: 'TRANSPORTER' },
  { value: 'VET', label: 'VET' },
  { value: 'OTHER', label: 'OTHER' },
];

interface Provider {
  id: number;
  name: string;
  nit?: string;
  type?: string;
}

export default function EditProviderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [name, setName] = useState('');
  const [nit, setNit] = useState('');
  const [type, setType] = useState('PROVIDER');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<Provider>(`/providers/${id}`);
        setName(res.name ?? '');
        setNit(res.nit ?? '');
        setType(res.type ?? 'PROVIDER');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar el proveedor');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiFetch(`/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, nit, type }),
      });
      router.push('/providers');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el proveedor');
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
        Editar Proveedor
      </h1>

      {loading && (
        <div className="text-center py-12">
          <div className="w-9 h-9 border-3 border-border rounded-full border-t-primary animate-spin mx-auto" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {!loading && (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input label="Nombre" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="NIT" type="text" value={nit} onChange={(e) => setNit(e.target.value)} />
            <Select label="Tipo" options={TYPES} value={type} onChange={(e) => setType(e.target.value)} required />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Actualizar Proveedor'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
