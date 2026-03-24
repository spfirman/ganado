'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-on-surface-muted">Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="font-heading text-2xl font-bold text-on-surface m-0">Configurar Autenticación de Dos Factores</h1>
      <p className="text-on-surface-muted mt-1 mb-8 text-[0.9375rem]">
        Protege tu cuenta con un segundo paso de verificación usando una aplicación autenticadora.
      </p>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {/* Paso inicial */}
      {!started && (
        <Card>
          <h2 className="text-[1.0625rem] font-bold text-on-surface m-0 mb-2">¿Cómo funciona?</h2>
          <ol className="my-4 pl-5 text-on-surface leading-loose">
            <li>Instala una aplicación autenticadora (Google Authenticator, Authy, etc.)</li>
            <li>Escanea el código QR que se generará</li>
            <li>Ingresa el código de 6 dígitos para verificar</li>
            <li>Guarda tus códigos de respaldo en un lugar seguro</li>
          </ol>
          <Button onClick={handleStartSetup} disabled={submitting}>
            {submitting ? 'Configurando...' : 'Comenzar Configuración'}
          </Button>
        </Card>
      )}

      {/* Paso QR */}
      {step === 'qr' && (
        <Card>
          <h2 className="text-[1.0625rem] font-bold text-on-surface m-0 mb-2">Paso 1: Escanea el Código QR</h2>
          <p className="text-on-surface-muted text-sm mb-4">
            Abre tu aplicación autenticadora y escanea este código QR.
          </p>
          <div className="text-center my-6">
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="Código QR para 2FA"
                className="rounded-lg border border-border-light"
                style={{ width: 220, height: 220 }}
              />
            )}
          </div>
          <div className="bg-surface border border-border-light rounded-lg px-4 py-3 flex flex-col gap-1.5">
            <span className="text-xs text-on-surface-muted font-semibold">
              CLAVE MANUAL (si no puedes escanear):
            </span>
            <code className="text-[0.9375rem] font-mono break-all text-on-surface">
              {secret}
            </code>
          </div>

          <h2 className="text-[1.0625rem] font-bold text-on-surface mt-8 mb-2">Paso 2: Códigos de Respaldo</h2>
          <p className="text-on-surface-muted text-sm mb-3">
            Guarda estos códigos en un lugar seguro. Puedes usarlos si pierdes acceso a tu app autenticadora.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {backupCodes.map((c, i) => (
              <code key={i} className="bg-surface rounded-md p-2 text-center font-mono text-[0.8125rem] text-on-surface">{c}</code>
            ))}
          </div>

          <h2 className="text-[1.0625rem] font-bold text-on-surface mt-8 mb-2">Paso 3: Verifica</h2>
          <form onSubmit={handleVerify} className="mt-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="Código de 6 dígitos"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  required
                  className="[&_input]:text-center [&_input]:text-lg [&_input]:tracking-widest"
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Verificando...' : 'Activar 2FA'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Paso completado */}
      {step === 'done' && (
        <Card>
          <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-[0.9375rem] font-semibold">
            Autenticación de dos factores activada correctamente.
          </div>
          <p className="text-on-surface mt-4 text-sm">
            A partir de ahora, cada vez que inicies sesión se te pedirá un código de tu aplicación autenticadora.
            Asegúrate de tener tus códigos de respaldo guardados.
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.push('/profile')}>
              Ir a Mi Perfil
            </Button>
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Ir al Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function OtpSetupPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-muted">Cargando...</div>}>
      <OtpSetupContent />
    </Suspense>
  );
}
