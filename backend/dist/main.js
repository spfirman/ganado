"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const all_exception_filter_1 = require("./common/filters/all-exception.filter");
const sanitize_pipe_1 = require("./common/pipes/sanitize.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionFilter());
    const configService = app.get(config_1.ConfigService);
    const logLevels = configService.get('ENVIRONMENT') === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'];
    common_1.Logger.overrideLogger(logLevels);
    app.useLogger(new common_1.Logger('FincaApp'));
    app.useGlobalPipes(new sanitize_pipe_1.SanitizeInputPipe(), new common_1.ValidationPipe({
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
            return new (require('@nestjs/common').HttpException)({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Validation failed',
                details: fields,
            }, 400);
        },
    }));
    app.setGlobalPrefix('api/v1');
    const swaggerCfg = new swagger_1.DocumentBuilder()
        .setTitle('API Finca')
        .setDescription('API para la aplicación de gestión de finca')
        .setVersion('0.1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerCfg);
    swagger_1.SwaggerModule.setup('api', app, document);
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
            const allowed = !origin ||
                corsOrigins.includes(origin) ||
                (corsAllowedLocal && origin.startsWith(corsAllowedLocal));
            if (allowed) {
                callback(null, true);
            }
            else {
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
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.disable('x-powered-by');
    const rateLimitDisabled = configService.get('RATE_LIMIT_DISABLED') === 'true';
    if (!rateLimitDisabled) {
        const authRateLimitMap = new Map();
        const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
        const AUTH_RATE_LIMIT_MAX = 10;
        const createRateLimiter = (limitMap, windowMs, maxRequests, message) => {
            return (req, res, next) => {
                if (req.method !== 'POST')
                    return next();
                const ip = req.ip || req.connection?.remoteAddress || 'unknown';
                const now = Date.now();
                let entry = limitMap.get(ip);
                if (limitMap.size > 10000) {
                    for (const [key, val] of limitMap) {
                        if (val.resetAt < now)
                            limitMap.delete(key);
                    }
                }
                if (!entry || entry.resetAt < now) {
                    entry = { count: 0, resetAt: now + windowMs };
                    limitMap.set(ip, entry);
                }
                entry.count++;
                res.setHeader('X-RateLimit-Limit', maxRequests);
                res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
                res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));
                if (entry.count > maxRequests) {
                    return res.status(429).json({
                        success: false,
                        message,
                        error: 'RATE_LIMIT_EXCEEDED',
                        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
                    });
                }
                next();
            };
        };
        const loginLimiter = createRateLimiter(authRateLimitMap, AUTH_RATE_LIMIT_WINDOW_MS, AUTH_RATE_LIMIT_MAX, 'Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde.');
        const recoveryRateLimitMap = new Map();
        const recoveryLimiter = createRateLimiter(recoveryRateLimitMap, AUTH_RATE_LIMIT_WINDOW_MS, 5, 'Demasiadas solicitudes. Intenta de nuevo más tarde.');
        expressApp.use('/api/v1/auth/login', loginLimiter);
        expressApp.use('/api/v1/auth/forgot-password', recoveryLimiter);
        expressApp.use('/api/v1/auth/reset-password', recoveryLimiter);
        expressApp.use('/api/v1/auth/passcode/request', recoveryLimiter);
        expressApp.use('/api/v1/auth/passcode/verify', recoveryLimiter);
    }
    else {
        common_1.Logger.log('Rate limiting DISABLED (RATE_LIMIT_DISABLED=true)', 'Security');
    }
    const port = configService.get('APP_PORT') ?? 3000;
    expressApp.get('/.well-known/ai.txt', (req, res) => {
        res.type('text/plain').send([
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
        ].join('\n'));
    });
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 API escuchando en http://localhost:${port} (env=${configService.get('ENVIRONMENT')})`);
}
bootstrap();
//# sourceMappingURL=main.js.map