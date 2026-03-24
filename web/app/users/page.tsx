'use client';

import { useEffect, useState, FormEvent } from 'react';
import { apiFetch } from '../lib/api';

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

  if (loading) {
    return (
      <div style={s.wrapper}>
        <div style={s.spinner} />
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Usuarios</h1>
        <button style={s.btnPrimary} onClick={openNew}>+ Nuevo Usuario</button>
      </div>

      {error && <div style={s.alert}>{error}</div>}

      {/* Modal / Form */}
      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.fieldGrid}>
                <div style={s.field}>
                  <label style={s.label}>Usuario</label>
                  <input style={s.input} value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email</label>
                  <input style={s.input} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Nombre</label>
                  <input style={s.input} value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Apellido</label>
                  <input style={s.input} value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Contraseña{editingId ? ' (dejar vacío para no cambiar)' : ''}</label>
                  <input style={s.input} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required={!editingId} />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Roles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {roles.map(r => (
                    <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.roleIds.includes(r.id)} onChange={() => toggleRole(r.id)} />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" style={s.btnSecondary} onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" style={s.btnPrimary} disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={s.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Usuario</th>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Activo</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#9ca3af' }}>No hay usuarios registrados</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td style={s.td}>{u.username}</td>
                  <td style={s.td}>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</td>
                  <td style={s.td}>{u.email || '—'}</td>
                  <td style={s.td}>
                    <button
                      style={{
                        ...s.badge,
                        background: u.is_active ? '#dcfce7' : '#fee2e2',
                        color: u.is_active ? '#166534' : '#991b1b',
                        cursor: 'pointer',
                        border: 'none',
                      }}
                      onClick={() => toggleActive(u)}
                    >
                      {u.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnSmall} onClick={() => openEdit(u)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const PRIMARY = '#16a34a';

const s: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { padding: '2rem', maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' },
  th: { textAlign: 'left' as const, padding: '0.75rem 1rem', borderBottom: '2px solid #e5e7eb', fontWeight: 600, color: '#374151', background: '#f9fafb' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', color: 'var(--foreground)' },
  badge: { display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600 },
  btnPrimary: { padding: '0.625rem 1.25rem', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  btnSecondary: { padding: '0.625rem 1.25rem', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  btnSmall: { padding: '0.375rem 0.75rem', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.8125rem', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' },
  modal: { background: 'var(--background, #fff)', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 540, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' as const },
  modalTitle: { fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--foreground)' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151' },
  input: { padding: '0.625rem 0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
};
