'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Card from '../components/ui/Card';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-border rounded-full border-t-primary animate-spin" />
        <p className="text-on-surface-muted mt-4">Cargando roles...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Roles y Permisos</h1>
      <p className="text-on-surface-muted mt-1 mb-8 text-base">Administra los roles del sistema y sus permisos asociados.</p>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {roles.length === 0 ? (
        <Card className="text-center text-on-surface-muted py-8">
          No hay roles configurados
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {roles.map(role => (
            <Card key={role.id} padding="none">
              <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
                <div>
                  <h2 className="text-lg font-bold text-on-surface m-0">{role.name}</h2>
                  {role.description && <p className="text-sm text-on-surface-muted mt-1 mb-0">{role.description}</p>}
                </div>
                {saving === role.id && <span className="text-xs text-on-surface-muted">Guardando...</span>}
              </div>

              {role.permissions && role.permissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm font-body">
                    <thead>
                      <tr className="bg-surface">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-muted border-b border-border">Recurso</th>
                        {PERM_KEYS.map(k => (
                          <th key={k} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-on-surface-muted border-b border-border">{PERM_LABELS[k]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((perm, pi) => (
                        <tr key={pi}>
                          <td className="px-4 py-3 text-on-surface border-b border-border-light">{perm.resource || `Permiso ${pi + 1}`}</td>
                          {PERM_KEYS.map(k => (
                            <td key={k} className="px-4 py-3 text-center border-b border-border-light">
                              <label className="inline-flex cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!perm[k]}
                                  onChange={() => togglePermission(role, pi, k)}
                                  className="hidden"
                                />
                                <span
                                  className={`inline-block relative rounded-full transition-colors duration-200 ${perm[k] ? 'bg-primary' : 'bg-border'}`}
                                  style={{ width: 36, height: 20 }}
                                >
                                  <span
                                    className="block absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200"
                                    style={{ width: 16, height: 16, transform: perm[k] ? 'translateX(16px)' : 'translateX(0)' }}
                                  />
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
                <p className="px-6 py-4 text-on-surface-muted text-sm m-0">
                  Sin permisos configurados para este rol.
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
