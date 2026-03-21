import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalFilters(new AllExceptionFilter());

  const configService = app.get(ConfigService);

  const logLevels: any[] =
    configService.get('ENVIRONMENT') === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'];
  Logger.overrideLogger(logLevels);
  app.useLogger(new Logger('FincaApp'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const fields = errors.map((err) => ({
          field: err.property,
          errors: err.constraints
            ? Object.values(err.constraints)
            : ['Validation failed'],
          value: err.value,
        }));
        return new (require('@nestjs/common').HttpException)(
          {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation failed',
            details: fields,
          },
          400,
        );
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  const swaggerCfg = new DocumentBuilder()
    .setTitle('API Finca')
    .setDescription('API para la aplicación de gestión de finca')
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('api', app, document);

  const corsOrigins = configService
    .get('CORS_ORIGINS')
    ?.split(',')
    .map((origin) => origin.trim()) || [
    'http://localhost',
    'http://127.0.0.1',
  ];
  const corsAllowedLocal = configService.get('CORS_ALLOWED_LOCAL')?.trim();

  app.enableCors({
    origin: (origin, callback) => {
      const allowed =
        !origin ||
        corsOrigins.includes(origin) ||
        (corsAllowedLocal && origin.startsWith(corsAllowedLocal));
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  // ─── Security Hardening ──────────────────────────────────────────────
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('x-powered-by');

  // In-memory rate limiter for auth endpoints (no external package required)
  const authRateLimitMap = new Map<string, { count: number; resetAt: number }>();
  const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const AUTH_RATE_LIMIT_MAX = 10; // max 10 failed auth attempts per 15 min per IP

  expressApp.use('/api/v1/auth/login', (req: any, res: any, next: any) => {
    if (req.method !== 'POST') return next();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = authRateLimitMap.get(ip);

    // Clean up expired entries periodically
    if (authRateLimitMap.size > 10000) {
      for (const [key, val] of authRateLimitMap) {
        if (val.resetAt < now) authRateLimitMap.delete(key);
      }
    }

    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS };
      authRateLimitMap.set(ip, entry);
    }

    entry.count++;

    res.setHeader('X-RateLimit-Limit', AUTH_RATE_LIMIT_MAX);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, AUTH_RATE_LIMIT_MAX - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));

    if (entry.count > AUTH_RATE_LIMIT_MAX) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
    }
    next();
  });

  const port = configService.get('APP_PORT') ?? 3000;

  // AI discovery file
  expressApp.get('/.well-known/ai.txt', (req, res) => {
    res.type('text/plain').send(
      [
        '# Finca Ganadera (Ganado) - AI Agent Access Policy',
        'Name: Finca Ganadera',
        'Description: Livestock and cattle ranch management platform',
        'Version: 0.1.0',
        'Contact: steve@gpcb.com.co',
        '',
        '# AI Testing Access',
        'AI-Testing-Enabled: true',
        'AI-Testing-Base-URL: https://ganado.gpcb.com.co',
        'AI-Testing-Endpoint: /api/v1/ai-testing/verify',
        'AI-Testing-Auth-Header: x-ai-test-token',
        'AI-Testing-Docs: /api/v1/ai-testing/capabilities',
        '',
        'AI-Rate-Limit: 200 requests per 15 minutes',
        'AI-Sitemap: /api/v1/ai-testing/sitemap',
      ].join('\n'),
    );
  });

  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 API escuchando en http://localhost:${port} (env=${configService.get('ENVIRONMENT')})`,
  );
}
bootstrap();
