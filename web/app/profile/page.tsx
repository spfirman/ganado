'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { apiFetch } from '../lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Estado 2FA
  const [otpStatus, setOtpStatus] = useState<{ isEnabled: boolean; backupCodesRemaining: number } | null>(null);
  const [otpLoading, setOtpLoading] = useState(true);
  const [disableCode, setDisableCode] = useState('');
  const [disabling2fa, setDisabling2fa] = useState(false);
  const [otpMsg, setOtpMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    async function loadOtpStatus() {
      try {
        const status = await apiFetch<{ isEnabled: boolean; backupCodesRemaining: number }>('/auth/otp/status');
        setOtpStatus(status);
      } catch {
        // Si falla, simplemente no mostramos el estado
      } finally {
        setOtpLoading(false);
      }
    }
    if (user) loadOtpStatus();
  }, [user]);

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    try {
      await apiFetch(`/users/${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
        }),
      });
      // Update localStorage user
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ganado_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.first_name = firstName;
            parsed.last_name = lastName;
            parsed.email = email;
            localStorage.setItem('ganado_user', JSON.stringify(parsed));
          } catch { /* ignore */ }
        }
      }
      setProfileMsg({ type: 'ok', text: 'Perfil actualizado correctamente.' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: err instanceof Error ? err.message : 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'err', text: 'Las contraseñas no coinciden.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: 'err', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setChangingPw(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwMsg({ type: 'ok', text: 'Contraseña actualizada correctamente.' });
    } catch (err) {
      setPwMsg({ type: 'err', text: err instanceof Error ? err.message : 'Error al cambiar contraseña' });
    } finally {
      setChangingPw(false);
    }
  }

  if (!user) {
    return (
      <div style={s.wrapper}>
        <p style={{ color: '#6b7280' }}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Mi Perfil</h1>
      <p style={s.subtitle}>Administra tu información personal y contraseña.</p>

      {/* User info card */}
      <div style={{ ...s.card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={s.avatar}>
            {(user.first_name?.[0] ?? user.username[0]).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--foreground)' }}>
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>@{user.username}</div>
            {user.role && <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>{user.role}</div>}
          </div>
        </div>

        <form onSubmit={handleProfileSave}>
          <div style={s.fieldGrid}>
            <div style={s.field}>
              <label style={s.label}>Nombre</label>
              <input style={s.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Apellido</label>
              <input style={s.input} value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {profileMsg && (
            <div style={profileMsg.type === 'ok' ? s.successMsg : s.errorMsg}>
              {profileMsg.text}
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <button type="submit" style={s.btnPrimary} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Password change */}
      <div style={{ ...s.card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--foreground)' }}>
          Cambiar Contraseña
        </h2>
        <form onSubmit={handlePasswordChange}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 360 }}>
            <div style={s.field}>
              <label style={s.label}>Contraseña Actual</label>
              <input style={s.input} type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Nueva Contraseña</label>
              <input style={s.input} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirmar Nueva Contraseña</label>
              <input style={s.input} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
          </div>

          {pwMsg && (
            <div style={pwMsg.type === 'ok' ? s.successMsg : s.errorMsg}>
              {pwMsg.text}
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <button type="submit" style={s.btnPrimary} disabled={changingPw}>
              {changingPw ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>

      {/* Autenticación de Dos Factores */}
      <div style={{ ...s.card, padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--foreground)' }}>
          Autenticación de Dos Factores (2FA)
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 1rem' }}>
          Agrega una capa adicional de seguridad a tu cuenta usando una aplicación autenticadora.
        </p>

        {otpLoading ? (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Cargando estado de 2FA...</p>
        ) : otpStatus?.isEnabled ? (
          <>
            <div style={s.successMsg}>
              2FA está activado. Códigos de respaldo restantes: {otpStatus.backupCodesRemaining}
            </div>
            <div style={{ marginTop: '1rem', maxWidth: 360 }}>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 0.75rem' }}>
                Para desactivar 2FA, ingresa un código de tu app autenticadora o un código de respaldo:
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <input
                    style={s.input}
                    type="text"
                    value={disableCode}
                    onChange={e => setDisableCode(e.target.value)}
                    placeholder="Código de verificación"
                    maxLength={8}
                  />
                </div>
                <button
                  style={{ ...s.btnPrimary, background: '#dc2626' }}
                  disabled={disabling2fa || !disableCode}
                  onClick={async () => {
                    setOtpMsg(null);
                    setDisabling2fa(true);
                    try {
                      await apiFetch('/auth/otp/disable', {
                        method: 'POST',
                        body: JSON.stringify({ code: disableCode }),
                      });
                      setOtpStatus({ isEnabled: false, backupCodesRemaining: 0 });
                      setDisableCode('');
                      setOtpMsg({ type: 'ok', text: 'Autenticación de dos factores desactivada.' });
                    } catch (err) {
                      setOtpMsg({ type: 'err', text: err instanceof Error ? err.message : 'Error al desactivar 2FA' });
                    } finally {
                      setDisabling2fa(false);
                    }
                  }}
                >
                  {disabling2fa ? 'Desactivando...' : 'Desactivar 2FA'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem' }}>
              2FA no está activado. Actívalo para mayor seguridad.
            </p>
            <button
              style={s.btnPrimary}
              onClick={() => router.push('/otp-setup')}
            >
              Activar 2FA
            </button>
          </div>
        )}

        {otpMsg && (
          <div style={{ ...(otpMsg.type === 'ok' ? s.successMsg : s.errorMsg), marginTop: '1rem' }}>
            {otpMsg.text}
          </div>
        )}
      </div>
    </div>
  );
}

const PRIMARY = '#16a34a';

const s: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  container: { padding: '2rem', maxWidth: 700, margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  subtitle: { color: '#6b7280', marginTop: '0.25rem', marginBottom: '2rem', fontSize: '1rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  avatar: { width: 56, height: 56, borderRadius: '50%', background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151' },
  input: { padding: '0.625rem 0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
  btnPrimary: { padding: '0.625rem 1.5rem', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  successMsg: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginTop: '1rem' },
  errorMsg: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginTop: '1rem' },
};
