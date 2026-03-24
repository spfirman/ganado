import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private ses: SESClient;
  private fromAddress: string;
  private appName: string;

  constructor() {
    this.ses = new SESClient({
      region: process.env.AWS_SES_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.fromAddress = process.env.EMAIL_FROM || 'noreply@ganado.gpcb.com.co';
    this.appName = process.env.EMAIL_APP_NAME || 'GPCB Ganado';
  }

  async sendPasswordReset(to: string, token: string, resetUrl: string): Promise<void> {
    const subject = `${this.appName} — Restablecer contraseña`;
    const html = this.passwordResetTemplate(resetUrl);
    await this.send(to, subject, html);
  }

  async sendPasscode(to: string, code: string): Promise<void> {
    const subject = `${this.appName} — Tu código de acceso: ${code}`;
    const html = this.passcodeTemplate(code);
    await this.send(to, subject, html);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.ses.send(new SendEmailCommand({
        Source: `${this.appName} <${this.fromAddress}>`,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Html: { Data: html, Charset: 'UTF-8' } },
        },
      }));
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error}`);
      // Don't throw — email failure should not block auth flow
    }
  }

  private passwordResetTemplate(resetUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #fafaf5; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 24px rgba(26,26,46,0.05);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-family: 'Noto Serif', Georgia, serif; color: #1B5E20; font-size: 20px; margin: 0;">
        ${this.appName}
      </h1>
    </div>
    <p style="color: #1A1A2E; font-size: 14px; line-height: 1.6;">Hola,</p>
    <p style="color: #4B5563; font-size: 14px; line-height: 1.6;">
      Recibimos una solicitud para restablecer tu contraseña en <strong>${this.appName}</strong>.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to bottom, #1B5E20, #2E7D32); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Restablecer Contraseña
      </a>
    </div>
    <p style="color: #4B5563; font-size: 13px; line-height: 1.6;">
      Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este correo.
    </p>
    <hr style="border: none; border-top: 1px solid #EFEFE8; margin: 32px 0;" />
    <p style="color: #9CA3AF; font-size: 11px; text-align: center;">
      — Equipo ${this.appName}
    </p>
  </div>
</body>
</html>`;
  }

  private passcodeTemplate(code: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #fafaf5; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 24px rgba(26,26,46,0.05);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-family: 'Noto Serif', Georgia, serif; color: #1B5E20; font-size: 20px; margin: 0;">
        ${this.appName}
      </h1>
    </div>
    <p style="color: #1A1A2E; font-size: 14px; line-height: 1.6;">Hola,</p>
    <p style="color: #4B5563; font-size: 14px; line-height: 1.6;">
      Tu código de acceso para <strong>${this.appName}</strong> es:
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; padding: 16px 48px; background: #1B5E20; border-radius: 12px; letter-spacing: 12px; font-size: 32px; font-weight: 700; color: #C8E6C9; font-family: monospace;">
        ${code}
      </div>
    </div>
    <p style="color: #4B5563; font-size: 13px; line-height: 1.6;">
      Este código expira en <strong>10 minutos</strong>. No compartas este código con nadie.
    </p>
    <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6;">
      Si no solicitaste este código, puedes ignorar este correo.
    </p>
    <hr style="border: none; border-top: 1px solid #EFEFE8; margin: 32px 0;" />
    <p style="color: #9CA3AF; font-size: 11px; text-align: center;">
      — Equipo ${this.appName}
    </p>
  </div>
</body>
</html>`;
  }
}
