'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

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
      <div style={s.wrapper}>
        <div style={s.spinner} />
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>Cargando configuración...</p>
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
    <div style={s.container}>
      <h1 style={s.title}>Configuración</h1>
      <p style={s.subtitle}>Información de la empresa y preferencias del sistema.</p>

      {error && <div style={s.alert}>{error}</div>}

      {/* Company Info */}
      <div style={{ ...s.card, marginBottom: '1.5rem' }}>
        <div style={s.cardHeader}>
          <h2 style={s.sectionTitle}>Información de la Empresa</h2>
        </div>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {tenant ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {companyFields.map(f => (
                <div key={f.key} style={s.kvRow}>
                  <span style={s.kvLabel}>{f.label}</span>
                  <span style={s.kvValue}>{tenant[f.key] != null ? String(tenant[f.key]) : '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>
              No se pudo cargar la información de la empresa.
            </p>
          )}
        </div>
      </div>

      {/* System Preferences */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.sectionTitle}>Preferencias del Sistema</h2>
        </div>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {settings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {settings.map((entry, i) => (
                <div key={i} style={{ ...s.kvRow, padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: 8 }}>
                  <span style={s.kvLabel}>{entry.key}</span>
                  <span style={s.kvValue}>{entry.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>
              No hay preferencias configuradas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const PRIMARY = '#16a34a';

const s: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { padding: '2rem', maxWidth: 900, margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  subtitle: { color: '#6b7280', marginTop: '0.25rem', marginBottom: '2rem', fontSize: '1rem' },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  cardHeader: { padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: '1.0625rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  kvRow: { display: 'flex', flexDirection: 'column' as const, gap: '0.25rem' },
  kvLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.025em' },
  kvValue: { fontSize: '0.9375rem', color: 'var(--foreground)' },
};
