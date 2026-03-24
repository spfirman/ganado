'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface Permission {
  id?: number;
  resource?: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_list: boolean;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

const PERM_KEYS: (keyof Pick<Permission, 'can_create' | 'can_read' | 'can_update' | 'can_delete' | 'can_list'>)[] = [
  'can_create', 'can_read', 'can_update', 'can_delete', 'can_list',
];

const PERM_LABELS: Record<string, string> = {
  can_create: 'Crear',
  can_read: 'Leer',
  can_update: 'Editar',
  can_delete: 'Eliminar',
  can_list: 'Listar',
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  async function loadRoles() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Role[] | { data: Role[] }>('/roles');
      setRoles(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRoles(); }, []);

  async function togglePermission(role: Role, permIndex: number, key: keyof Permission) {
    if (!role.permissions) return;
    const perm = role.permissions[permIndex];
    const updated = { ...perm, [key]: !perm[key] };
    setSaving(role.id);
    try {
      const updatedPerms = [...role.permissions];
      updatedPerms[permIndex] = updated;
      await apiFetch(`/roles/${role.id}`, {
        method: 'PUT',
        body: JSON.stringify({ permissions: updatedPerms }),
      });
      setRoles(prev => prev.map(r =>
        r.id === role.id ? { ...r, permissions: updatedPerms } : r
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar permiso');
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div style={s.wrapper}>
        <div style={s.spinner} />
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>Cargando roles...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Roles y Permisos</h1>
      <p style={s.subtitle}>Administra los roles del sistema y sus permisos asociados.</p>

      {error && <div style={s.alert}>{error}</div>}

      {roles.length === 0 ? (
        <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
          No hay roles configurados
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {roles.map(role => (
            <div key={role.id} style={s.card}>
              <div style={s.cardHeader}>
                <div>
                  <h2 style={s.roleName}>{role.name}</h2>
                  {role.description && <p style={s.roleDesc}>{role.description}</p>}
                </div>
                {saving === role.id && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Guardando...</span>}
              </div>

              {role.permissions && role.permissions.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Recurso</th>
                        {PERM_KEYS.map(k => (
                          <th key={k} style={{ ...s.th, textAlign: 'center' }}>{PERM_LABELS[k]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((perm, pi) => (
                        <tr key={pi}>
                          <td style={s.td}>{perm.resource || `Permiso ${pi + 1}`}</td>
                          {PERM_KEYS.map(k => (
                            <td key={k} style={{ ...s.td, textAlign: 'center' }}>
                              <label style={s.toggle}>
                                <input
                                  type="checkbox"
                                  checked={!!perm[k]}
                                  onChange={() => togglePermission(role, pi, k)}
                                  style={{ display: 'none' }}
                                />
                                <span style={{
                                  ...s.toggleTrack,
                                  background: perm[k] ? '#16a34a' : '#d1d5db',
                                }}>
                                  <span style={{
                                    ...s.toggleKnob,
                                    transform: perm[k] ? 'translateX(16px)' : 'translateX(0)',
                                  }} />
                                </span>
                              </label>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                  Sin permisos configurados para este rol.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PRIMARY = '#16a34a';

const s: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { padding: '2rem', maxWidth: 1100, margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  subtitle: { color: '#6b7280', marginTop: '0.25rem', marginBottom: '2rem', fontSize: '1rem' },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  cardHeader: { padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  roleName: { fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  roleDesc: { margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' },
  th: { textAlign: 'left' as const, padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#374151', background: '#f9fafb', fontSize: '0.8125rem' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', color: 'var(--foreground)' },
  toggle: { display: 'inline-flex', cursor: 'pointer' },
  toggleTrack: { display: 'inline-block', width: 36, height: 20, borderRadius: 10, position: 'relative' as const, transition: 'background 0.2s' },
  toggleKnob: { display: 'block', width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute' as const, top: 2, left: 2, transition: 'transform 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' },
};
