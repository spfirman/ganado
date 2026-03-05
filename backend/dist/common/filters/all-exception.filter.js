"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const QueryFailedError_1 = require("typeorm/error/QueryFailedError");
const class_validator_1 = require("class-validator");
let AllExceptionFilter = AllExceptionFilter_1 = class AllExceptionFilter {
    logger = new common_1.Logger(AllExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode;
        let message;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
            this.logger.debug("LOG 1", exception);
        }
        else if (exception instanceof Error &&
            exception.message.includes('no result was found')) {
            this.logger.debug("LOG 2");
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            message = 'Credenciales inválidas';
        }
        else if (exception instanceof QueryFailedError_1.QueryFailedError) {
            this.logger.debug("LOG 3");
            statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Error en la consulta de base de datos';
        }
        else if (exception instanceof class_validator_1.ValidationError) {
            this.logger.debug("LOG 4");
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            message = 'Validación fallida';
        }
        else if (exception instanceof common_1.ConflictException) {
            this.logger.debug("LOG 5");
            statusCode = common_1.HttpStatus.CONFLICT;
            message = 'Conflicto';
        }
        else if (exception instanceof Error) {
            this.logger.debug("LOG 6");
            statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Error interno del servidor';
        }
        else {
            this.logger.debug("LOG 7");
            statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Error desconocido';
        }
        if (!(exception instanceof common_1.UnauthorizedException) && !(exception instanceof common_1.ForbiddenException)) {
            this.logger.error({ type: this.getErrorType(exception), error: exception });
        }
        return response.status(statusCode).json({
            success: false,
            message,
            error: this.getErrorType(exception),
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
    getErrorType(exception) {
        if (exception instanceof common_1.HttpException) {
            return `HTTP_${exception.constructor.name}`;
        }
        if (exception instanceof typeorm_1.TypeORMError) {
            return 'TYPEORM_ERROR';
        }
        if (exception instanceof QueryFailedError_1.QueryFailedError) {
            return 'DATABASE_QUERY_ERROR';
        }
        if (exception instanceof class_validator_1.ValidationError) {
            return 'VALIDATION_ERROR';
        }
        return 'UNKNOWN_ERROR';
    }
};
exports.AllExceptionFilter = AllExceptionFilter;
exports.AllExceptionFilter = AllExceptionFilter = AllExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionFilter);
//# sourceMappingURL=all-exception.filter.js.map