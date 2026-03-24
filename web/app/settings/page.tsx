'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import Card from '../components/ui/Card';
import ThemePicker from '../components/ui/ThemePicker';

interface TenantInfo {
  id?: number;
  name?: string;
  company_name?: string;
  company_username?: string;
  email?: string;
  phone?: string;
  address?: string;
  [key: string]: unknown;
}

interface SettingEntry {
  key: string;
  value: string;
}

export default function SettingsPage() {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [settings, setSettings] = useState<SettingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [tenantData, settingsData] = await Promise.allSettled([
          apiFetch<TenantInfo>('/tenant'),
          apiFetch<SettingEntry[] | Record<string, string> | { data: SettingEntry[] }>('/settings'),
        ]);

        if (tenantData.status === 'fulfilled') {
          setTenant(tenantData.value);
        }

        if (settingsData.status === 'fulfilled') {
          const raw = settingsData.value;
          if (Array.isArray(raw)) {
            setSettings(raw);
          } else if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: SettingEntry[] }).data)) {
            setSettings((raw as { data: SettingEntry[] }).data);
          } else if (raw && typeof raw === 'object') {
            setSettings(
              Object.entries(raw as Record<string, string>)
                .filter(([k]) => k !== 'data')
                .map(([key, value]) => ({ key, value: String(value) }))
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar configuración');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-border rounded-full border-t-primary animate-spin" />
        <p className="text-on-surface-muted mt-4">Cargando configuración...</p>
      </div>
    );
  }

  const companyFields: { label: string; key: keyof TenantInfo }[] = [
    { label: 'Nombre de la Empresa', key: 'company_name' },
    { label: 'Identificador', key: 'company_username' },
    { label: 'Nombre', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Teléfono', key: 'phone' },
    { label: 'Dirección', key: 'address' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Configuración</h1>
      <p className="text-on-surface-muted mt-1 mb-8 text-base">Información de la empresa y preferencias del sistema.</p>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {/* Company Info */}
      <Card padding="none" className="mb-6">
        <div className="px-6 py-4 border-b border-border-light">
          <h2 className="text-[1.0625rem] font-bold text-on-surface m-0">Información de la Empresa</h2>
        </div>
        <div className="px-6 py-5">
          {tenant ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {companyFields.map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">{f.label}</span>
                  <span className="text-[0.9375rem] text-on-surface">{tenant[f.key] != null ? String(tenant[f.key]) : '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-muted text-sm m-0">
              No se pudo cargar la información de la empresa.
            </p>
          )}
        </div>
      </Card>

      {/* Theme Preferences */}
      <Card padding="none" className="mb-6">
        <div className="px-6 py-4 border-b border-border-light">
          <h2 className="text-[1.0625rem] font-bold text-on-surface m-0">Preferencias de Apariencia</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-on-surface-muted mb-4 mt-0">Selecciona un tema para personalizar la apariencia del sistema.</p>
          <ThemePicker />
        </div>
      </Card>

      {/* System Preferences */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-border-light">
          <h2 className="text-[1.0625rem] font-bold text-on-surface m-0">Preferencias del Sistema</h2>
        </div>
        <div className="px-6 py-5">
          {settings.length > 0 ? (
            <div className="flex flex-col gap-3">
              {settings.map((entry, i) => (
                <div key={i} className="flex flex-col gap-1 bg-surface rounded-lg px-4 py-3">
                  <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">{entry.key}</span>
                  <span className="text-[0.9375rem] text-on-surface">{entry.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-muted text-sm m-0">
              No hay preferencias configuradas.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
