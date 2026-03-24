'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '../lib/api';
import { useAuth } from '../lib/auth-context';

function OtpSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState<'loading' | 'qr' | 'verify' | 'done'>('loading');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  async function handleStartSetup() {
    setError(null);
    setSubmitting(true);
    try {
      const data = await apiFetch<{
        qrCodeUrl: string;
        secret: string;
        backupCodes: string[];
      }>('/auth/otp/setup', { method: 'POST' });

      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
      setBackupCodes(data.backupCodes);
      setStep('qr');
      setStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al configurar 2FA');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/auth/otp/verify-setup', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div style={s.wrapper}>
        <p style={{ color: '#6b7280' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Configurar Autenticación de Dos Factores</h1>
      <p style={s.subtitle}>
        Protege tu cuenta con un segundo paso de verificación usando una aplicación autenticadora.
      </p>

      {error && <div style={s.errorMsg}>{error}</div>}

      {/* Paso inicial */}
      {!started && (
        <div style={s.card}>
          <h2 style={s.sectionTitle}>¿Cómo funciona?</h2>
          <ol style={{ margin: '1rem 0', paddingLeft: '1.25rem', color: '#374151', lineHeight: '1.8' }}>
            <li>Instala una aplicación autenticadora (Google Authenticator, Authy, etc.)</li>
            <li>Escanea el código QR que se generará</li>
            <li>Ingresa el código de 6 dígitos para verificar</li>
            <li>Guarda tus códigos de respaldo en un lugar seguro</li>
          </ol>
          <button onClick={handleStartSetup} style={s.btnPrimary} disabled={submitting}>
            {submitting ? 'Configurando...' : 'Comenzar Configuración'}
          </button>
        </div>
      )}

      {/* Paso QR */}
      {step === 'qr' && (
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Paso 1: Escanea el Código QR</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Abre tu aplicación autenticadora y escanea este código QR.
          </p>
          <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="Código QR para 2FA"
                style={{ width: 220, height: 220, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
            )}
          </div>
          <div style={s.secretBox}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
              CLAVE MANUAL (si no puedes escanear):
            </span>
            <code style={{ fontSize: '0.9375rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {secret}
            </code>
          </div>

          <h2 style={{ ...s.sectionTitle, marginTop: '2rem' }}>Paso 2: Códigos de Respaldo</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Guarda estos códigos en un lugar seguro. Puedes usarlos si pierdes acceso a tu app autenticadora.
          </p>
          <div style={s.backupGrid}>
            {backupCodes.map((c, i) => (
              <code key={i} style={s.backupCode}>{c}</code>
            ))}
          </div>

          <h2 style={{ ...s.sectionTitle, marginTop: '2rem' }}>Paso 3: Verifica</h2>
          <form onSubmit={handleVerify} style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Código de 6 dígitos</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  style={{ ...s.input, textAlign: 'center', fontSize: '1.125rem', letterSpacing: '0.2em' }}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" style={s.btnPrimary} disabled={submitting}>
                {submitting ? 'Verificando...' : 'Activar 2FA'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Paso completado */}
      {step === 'done' && (
        <div style={s.card}>
          <div style={s.successMsg}>
            Autenticación de dos factores activada correctamente.
          </div>
          <p style={{ color: '#374151', marginTop: '1rem', fontSize: '0.875rem' }}>
            A partir de ahora, cada vez que inicies sesión se te pedirá un código de tu aplicación autenticadora.
            Asegúrate de tener tus códigos de respaldo guardados.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => router.push('/profile')} style={s.btnPrimary}>
              Ir a Mi Perfil
            </button>
            <button onClick={() => router.push('/dashboard')} style={s.btnSecondary}>
              Ir al Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OtpSetupPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando...</div>}>
      <OtpSetupContent />
    </Suspense>
  );
}

const PRIMARY = '#16a34a';

const s: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  container: { padding: '2rem', maxWidth: 640, margin: '0 auto' },
  title: { fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' },
  subtitle: { color: '#6b7280', marginTop: '0.25rem', marginBottom: '2rem', fontSize: '0.9375rem' },
  card: { background: 'var(--background, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem' },
  sectionTitle: { fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--foreground)' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '0.375rem' },
  input: { padding: '0.625rem 0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
  btnPrimary: { padding: '0.625rem 1.5rem', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  btnSecondary: { padding: '0.625rem 1.5rem', background: 'transparent', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' },
  successMsg: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.9375rem', fontWeight: 600 },
  errorMsg: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  secretBox: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' },
  backupGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' },
  backupCode: { background: '#f3f4f6', borderRadius: 6, padding: '0.5rem', textAlign: 'center' as const, fontFamily: 'monospace', fontSize: '0.8125rem', color: '#1f2937' },
};
