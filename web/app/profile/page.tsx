'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { apiFetch } from '../lib/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ThemePicker from '../components/ui/ThemePicker';

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
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email }),
      });
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
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-on-surface-muted">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 className="font-heading text-3xl font-bold text-on-surface m-0">Mi Perfil</h1>
      <p className="text-on-surface-muted mt-1 mb-8 text-base">Administra tu información personal y contraseña.</p>

      {/* User info card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-bold shrink-0">
            {(user.first_name?.[0] ?? user.username[0]).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-lg text-on-surface">
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}
            </div>
            <div className="text-sm text-on-surface-muted">@{user.username}</div>
            {user.role && <div className="text-xs text-primary font-semibold mt-1">{user.role}</div>}
          </div>
        </div>

        <form onSubmit={handleProfileSave}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input label="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          {profileMsg && (
            <div className={`rounded-lg px-4 py-3 text-sm mt-4 ${profileMsg.type === 'ok' ? 'bg-success/10 border border-success/30 text-success' : 'bg-error/10 border border-error/30 text-error'}`}>
              {profileMsg.text}
            </div>
          )}

          <div className="mt-5">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Theme Preferences */}
      <Card className="mb-6">
        <h2 className="text-[1.0625rem] font-bold text-on-surface m-0 mb-3">Preferencias de Apariencia</h2>
        <p className="text-sm text-on-surface-muted mb-4 mt-0">Selecciona un tema para personalizar la apariencia.</p>
        <ThemePicker />
      </Card>

      {/* Password change */}
      <Card className="mb-6">
        <h2 className="text-[1.0625rem] font-bold text-on-surface m-0 mb-4">
          Cambiar Contraseña
        </h2>
        <form onSubmit={handlePasswordChange}>
          <div className="flex flex-col gap-4" style={{ maxWidth: 360 }}>
            <Input label="Contraseña Actual" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            <Input label="Nueva Contraseña" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <Input label="Confirmar Nueva Contraseña" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>

          {pwMsg && (
            <div className={`rounded-lg px-4 py-3 text-sm mt-4 ${pwMsg.type === 'ok' ? 'bg-success/10 border border-success/30 text-success' : 'bg-error/10 border border-error/30 text-error'}`}>
              {pwMsg.text}
            </div>
          )}

          <div className="mt-5">
            <Button type="submit" disabled={changingPw}>
              {changingPw ? 'Actualizando...' : 'Cambiar Contraseña'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 2FA */}
      <Card>
        <h2 className="text-[1.0625rem] font-bold text-on-surface m-0 mb-2">
          Autenticación de Dos Factores (2FA)
        </h2>
        <p className="text-[0.8125rem] text-on-surface-muted mb-4 mt-0">
          Agrega una capa adicional de seguridad a tu cuenta usando una aplicación autenticadora.
        </p>

        {otpLoading ? (
          <p className="text-on-surface-muted text-sm">Cargando estado de 2FA...</p>
        ) : otpStatus?.isEnabled ? (
          <>
            <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-sm">
              2FA está activado. Códigos de respaldo restantes: {otpStatus.backupCodesRemaining}
            </div>
            <div className="mt-4" style={{ maxWidth: 360 }}>
              <p className="text-[0.8125rem] text-on-surface-muted mb-3 mt-0">
                Para desactivar 2FA, ingresa un código de tu app autenticadora o un código de respaldo:
              </p>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={disableCode}
                    onChange={e => setDisableCode(e.target.value)}
                    placeholder="Código de verificación"
                    maxLength={8}
                  />
                </div>
                <Button
                  variant="danger"
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
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="text-sm text-on-surface-muted mb-4 mt-0">
              2FA no está activado. Actívalo para mayor seguridad.
            </p>
            <Button onClick={() => router.push('/otp-setup')}>
              Activar 2FA
            </Button>
          </div>
        )}

        {otpMsg && (
          <div className={`rounded-lg px-4 py-3 text-sm mt-4 ${otpMsg.type === 'ok' ? 'bg-success/10 border border-success/30 text-success' : 'bg-error/10 border border-error/30 text-error'}`}>
            {otpMsg.text}
          </div>
        )}
      </Card>
    </div>
  );
}
