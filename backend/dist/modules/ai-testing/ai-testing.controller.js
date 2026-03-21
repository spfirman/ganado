"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTestingController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const AI_AGENT_PATTERNS = [
    { name: 'ChatGPT', pattern: /ChatGPT-User/i },
    { name: 'GPTBot', pattern: /GPTBot/i },
    { name: 'Google-AI', pattern: /Google-Extended/i },
    { name: 'ClaudeBot', pattern: /ClaudeBot/i },
    { name: 'Claude-Web', pattern: /Claude-Web/i },
    { name: 'Perplexity', pattern: /PerplexityBot/i },
    { name: 'Bingbot', pattern: /Bingbot/i },
    { name: 'CopilotBot', pattern: /CopilotBot/i },
    { name: 'Applebot-AI', pattern: /Applebot/i },
    { name: 'Meta-AI', pattern: /Meta-ExternalAgent/i },
];
function detectAiAgent(userAgent) {
    if (!userAgent)
        return { isAiAgent: false, agentName: null };
    for (const { name, pattern } of AI_AGENT_PATTERNS) {
        if (pattern.test(userAgent))
            return { isAiAgent: true, agentName: name };
    }
    return { isAiAgent: false, agentName: null };
}
function getConfiguredTokens() {
    const tokenMap = new Map();
    const tokensEnv = process.env.AI_TEST_TOKENS || '';
    if (!tokensEnv)
        return tokenMap;
    for (const entry of tokensEnv.split(',')) {
        const parts = entry.trim().split(':');
        if (parts.length >= 1 && parts[0]) {
            const tokenHash = (0, crypto_1.createHash)('sha256').update(parts[0]).digest('hex');
            const label = parts[1] || 'default';
            const permissions = parts[2] ? parts[2].split('+') : ['read'];
            tokenMap.set(tokenHash, { label, permissions });
        }
    }
    return tokenMap;
}
function validateToken(token) {
    const tokens = getConfiguredTokens();
    const tokenHash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    const match = tokens.get(tokenHash);
    if (match)
        return { valid: true, label: match.label, permissions: match.permissions };
    return { valid: false, label: '', permissions: [] };
}
function extractToken(req) {
    const headerToken = req.headers['x-ai-test-token'];
    if (headerToken)
        return { token: headerToken, source: 'header' };
    const queryToken = req.query?.qa_access;
    if (queryToken)
        return { token: queryToken, source: 'query' };
    return { token: null, source: null };
}
function getAiContext(req) {
    const { isAiAgent, agentName } = detectAiAgent(req.headers['user-agent']);
    const { token, source } = extractToken(req);
    const context = { isAiAgent, agentName, tokenId: null, permissions: [], tokenSource: source };
    if (token) {
        const result = validateToken(token);
        if (result.valid) {
            context.tokenId = result.label;
            context.permissions = result.permissions;
            context.isAiAgent = true;
            if (!context.agentName)
                context.agentName = `token:${result.label}`;
        }
    }
    return context;
}
let AiTestingController = class AiTestingController {
    verify(req, res) {
        const context = getAiContext(req);
        const isAuthorized = !!(context.isAiAgent && context.tokenId);
        return res.json({
            status: 'ok',
            aiTesting: {
                enabled: !!process.env.AI_TEST_TOKENS,
                detected: context.isAiAgent,
                agentName: context.agentName,
                authorized: isAuthorized,
                tokenLabel: context.tokenId,
                permissions: context.permissions,
                tokenSource: context.tokenSource,
            },
            instructions: isAuthorized
                ? {
                    message: 'You are authorized for AI testing.',
                    capabilities: '/api/v1/ai-testing/capabilities',
                    sitemap: '/api/v1/ai-testing/sitemap',
                    testData: '/api/v1/ai-testing/test-data',
                    rateLimit: '200 requests per 15 minutes',
                }
                : {
                    message: context.tokenId === null && extractToken(req).token
                        ? 'Token provided but not recognized.'
                        : 'No AI testing token provided.',
                    howToAuthenticate: {
                        option1: { method: 'HTTP header', header: 'x-ai-test-token: <your-token>' },
                        option2: { method: 'URL parameter', example: '/api/v1/ai-testing/verify?qa_access=<token>' },
                    },
                    discoveryFile: '/.well-known/ai.txt',
                },
            timestamp: new Date().toISOString(),
        });
    }
    capabilities(req, res) {
        const context = getAiContext(req);
        if (!context.tokenId) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                error: 'Unauthorized',
                message: 'A valid AI testing token is required.',
                timestamp: new Date().toISOString(),
            });
        }
        res.header('X-AI-Testing-Access', 'granted');
        return res.json({
            application: 'Finca Ganadera (Ganado)',
            version: '0.1.0',
            description: 'Livestock and cattle ranch management platform. Tracks animals, production centers, employees, commerce, and IoT sensor data.',
            capabilities: {
                farm: {
                    description: 'Farm and ranch configuration',
                    endpoints: ['GET /api/v1/farm', 'GET /api/v1/farm/:id'],
                    features: ['Farm profiles', 'Location management', 'Paddock tracking'],
                },
                productionCenters: {
                    description: 'Production center and herd management',
                    endpoints: ['GET /api/v1/production-centers', 'GET /api/v1/production-centers/:id'],
                    features: ['Herd tracking', 'Breeding records', 'Weight monitoring', 'Health events'],
                },
                employees: {
                    description: 'Employee management for ranch workers',
                    endpoints: ['GET /api/v1/employees', 'GET /api/v1/employees/:id'],
                    features: ['Worker profiles', 'Role assignment', 'Work orders'],
                },
                commerce: {
                    description: 'Sales and purchase management',
                    endpoints: ['GET /api/v1/commerce/sales', 'GET /api/v1/commerce/purchases'],
                    features: ['Cattle sales', 'Purchase tracking', 'Price history'],
                },
                receptions: {
                    description: 'Purchase reception tracking',
                    endpoints: ['GET /api/v1/receptions', 'POST /api/v1/receptions'],
                    features: ['Delivery tracking', 'Quality inspection', 'Weight verification'],
                },
                iot: {
                    description: 'IoT sensor data (MQTT/ChirpStack)',
                    endpoints: ['GET /api/v1/mqtt/devices'],
                    features: ['Temperature sensors', 'GPS tracking', 'LoRaWAN integration'],
                },
            },
            authentication: {
                aiTesting: {
                    methods: [
                        { type: 'header', header: 'x-ai-test-token' },
                        { type: 'url-param', param: '?qa_access=<token>' },
                    ],
                    rateLimit: '200 requests per 15 minutes',
                    permissions: context.permissions,
                },
                standard: {
                    method: 'Bearer JWT via Authorization header',
                    loginEndpoint: 'POST /api/v1/auth/login',
                },
            },
            i18n: { supported: true, languages: ['es', 'en'], defaultLocale: 'es' },
            timestamp: new Date().toISOString(),
        });
    }
    sitemap(req, res) {
        const context = getAiContext(req);
        if (!context.tokenId) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                error: 'Unauthorized',
                message: 'A valid AI testing token is required.',
                timestamp: new Date().toISOString(),
            });
        }
        res.header('X-AI-Testing-Access', 'granted');
        return res.json({
            sitemap: {
                pages: [
                    { path: '/login', description: 'Login page', type: 'page' },
                    { path: '/dashboard', description: 'Main dashboard', type: 'page' },
                    { path: '/farm', description: 'Farm management', type: 'page' },
                    { path: '/production-centers', description: 'Production centers', type: 'page' },
                    { path: '/employees', description: 'Employee management', type: 'page' },
                    { path: '/commerce', description: 'Commerce (sales/purchases)', type: 'page' },
                    { path: '/settings', description: 'System settings', type: 'page' },
                ],
                apiGroups: [
                    { prefix: '/api/v1/health', description: 'Health checks', auth: 'none' },
                    { prefix: '/api/v1/ai-testing', description: 'AI testing access', auth: 'ai-token' },
                    { prefix: '/api/v1/auth', description: 'Authentication', auth: 'none|jwt' },
                    { prefix: '/api/v1/farm', description: 'Farm management', auth: 'jwt|ai-token' },
                    { prefix: '/api/v1/production-centers', description: 'Production centers', auth: 'jwt|ai-token' },
                    { prefix: '/api/v1/employees', description: 'Employees', auth: 'jwt|ai-token' },
                    { prefix: '/api/v1/commerce', description: 'Commerce', auth: 'jwt|ai-token' },
                    { prefix: '/api/v1/receptions', description: 'Purchase receptions', auth: 'jwt|ai-token' },
                    { prefix: '/api/v1/mqtt', description: 'IoT/MQTT devices', auth: 'jwt|ai-token' },
                ],
                discoveryFiles: [{ path: '/.well-known/ai.txt', description: 'AI agent access policy' }],
            },
            timestamp: new Date().toISOString(),
        });
    }
    testData(req, res) {
        const context = getAiContext(req);
        if (!context.tokenId) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                error: 'Unauthorized',
                message: 'A valid AI testing token is required.',
                timestamp: new Date().toISOString(),
            });
        }
        res.header('X-AI-Testing-Access', 'granted');
        return res.json({
            testData: {
                description: 'Synthetic sample data for verifying AI testing access. Not real business data.',
                farms: [
                    { id: 'sample-farm-001', name: 'Hacienda El Roble', hectares: 250, location: 'Antioquia' },
                ],
                animals: [
                    { id: 'sample-animal-001', tag: 'GA-001', breed: 'Brahman', weight_kg: 450, sex: 'female' },
                    { id: 'sample-animal-002', tag: 'GA-002', breed: 'Angus', weight_kg: 520, sex: 'male' },
                ],
                productionCenters: [
                    { id: 'sample-pc-001', name: 'Lote Norte', capacity: 100, currentCount: 45 },
                    { id: 'sample-pc-002', name: 'Lote Sur', capacity: 80, currentCount: 62 },
                ],
                metrics: {
                    totalAnimals: 320,
                    totalFarms: 2,
                    monthlySales: 45000000,
                    averageWeight_kg: 485,
                    activeSensors: 12,
                },
            },
            agent: context.agentName,
            permissions: context.permissions,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.AiTestingController = AiTestingController;
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiTestingController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('capabilities'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiTestingController.prototype, "capabilities", null);
__decorate([
    (0, common_1.Get)('sitemap'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiTestingController.prototype, "sitemap", null);
__decorate([
    (0, common_1.Get)('test-data'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiTestingController.prototype, "testData", null);
exports.AiTestingController = AiTestingController = __decorate([
    (0, common_1.Controller)('ai-testing')
], AiTestingController);
//# sourceMappingURL=ai-testing.controller.js.map