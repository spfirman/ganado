'use client';

import { useEffect, useState, FormEvent } from 'react';
import { apiFetch } from '../lib/api';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface Role {
  id: number;
  name: string;
}

interface UserRecord {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_active?: boolean;
  roles?: Role[];
}

const emptyForm = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleIds: [] as number[],
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        apiFetch<UserRecord[] | { data: UserRecord[] }>('/users'),
        apiFetch<Role[] | { data: Role[] }>('/roles'),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : usersData.data ?? []);
      setRoles(Array.isArray(rolesData) ? rolesData : rolesData.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(u: UserRecord) {
    setForm({
      username: u.username,
      firstName: u.first_name ?? '',
      lastName: u.last_name ?? '',
      email: u.email ?? '',
      password: '',
      roleIds: u.roles?.map(r => r.id) ?? [],
    });
    setEditingId(u.id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        username: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        role_ids: form.roleIds,
      };
      if (form.password) body.password = form.password;

      if (editingId) {
        await apiFetch(`/users/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        body.password = form.password;
        await apiFetch('/users', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(u: UserRecord) {
    try {
      await apiFetch(`/users/${u.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !u.is_active }),
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  }

  function toggleRole(id: number) {
    setForm(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(id)
        ? prev.roleIds.filter(r => r !== id)
        : [...prev.roleIds, id],
    }));
  }

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'name', label: 'Nombre', render: (u: UserRecord) => [u.first_name, u.last_name].filter(Boolean).join(' ') || '—' },
    { key: 'email', label: 'Email', render: (u: UserRecord) => u.email || '—' },
    { key: 'is_active', label: 'Activo', render: (u: UserRecord) => (
      <button
        className="cursor-pointer border-none px-0 bg-transparent"
        onClick={() => toggleActive(u)}
      >
        <Badge label={u.is_active ? 'Activo' : 'Inactivo'} variant={u.is_active ? 'success' : 'error'} />
      </button>
    )},
    { key: '_actions', label: 'Acciones', render: (u: UserRecord) => (
      <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>Editar</Button>
    )},
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Usuarios</h1>
        <Button onClick={openNew}>+ Nuevo Usuario</Button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'} maxWidth="540px">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Usuario" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <Input label="Nombre" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            <Input label="Apellido" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
            <Input label={`Contraseña${editingId ? ' (dejar vacío para no cambiar)' : ''}`} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required={!editingId} />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide block mb-1">Roles</label>
            <div className="flex flex-wrap gap-2">
              {roles.map(r => (
                <label key={r.id} className="flex items-center gap-1 text-sm cursor-pointer text-on-surface">
                  <input type="checkbox" checked={form.roleIds.includes(r.id)} onChange={() => toggleRole(r.id)} className="accent-primary" />
                  {r.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="No hay usuarios registrados" />
    </div>
  );
}
