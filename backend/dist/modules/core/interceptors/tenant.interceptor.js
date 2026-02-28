"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TenantInterceptor = class TenantInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.user?.tenantId;
        if (tenantId) {
            request.body = {
                ...request.body,
                tenantId,
            };
        }
        return next.handle().pipe((0, operators_1.map)(data => {
            if (Array.isArray(data)) {
                return data.map(item => ({
                    ...item,
                    tenantId,
                }));
            }
            return {
                ...data,
                tenantId,
            };
        }));
    }
};
exports.TenantInterceptor = TenantInterceptor;
exports.TenantInterceptor = TenantInterceptor = __decorate([
    (0, common_1.Injectable)()
], TenantInterceptor);
//# sourceMappingURL=tenant.interceptor.js.map