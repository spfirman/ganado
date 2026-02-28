"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const configService = app.get(config_1.ConfigService);
    const logLevels = configService.get('ENVIRONMENT') === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'];
    common_1.Logger.overrideLogger(logLevels);
    app.useLogger(new common_1.Logger('FincaApp'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
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
    const corsOrigins = configService.get('CORS_ORIGINS')?.split(',').map(origin => origin.trim()) || [
        'http://localhost',
        'http://127.0.0.1'
    ];
    const corsAllowedLocal = configService.get('CORS_ALLOWED_LOCAL')?.trim();
    app.enableCors({
        origin: (origin, callback) => {
            const allowed = !origin || corsOrigins.includes(origin) || (corsAllowedLocal && origin.startsWith(corsAllowedLocal));
            if (allowed) {
                callback(null, true);
            }
            else {
                callback(new Error(`Origin not allowed by CORS: ${origin}`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    });
    const port = configService.get('APP_PORT') ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 API escuchando en http://localhost:${port} (env=${configService.get('ENVIRONMENT')})`);
}
bootstrap();
//# sourceMappingURL=main.js.map