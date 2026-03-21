import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resp = exception.getResponse() as any;
      if (typeof resp === 'object' && resp !== null) {
        message = resp.message || exception.message;
        details = resp.details;
      } else {
        message = exception.message;
      }
      this.logger.debug('LOG 1', exception);
    } else if (
      exception instanceof Error &&
      exception.message.includes('no result was found')
    ) {
      this.logger.debug('LOG 2');
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Credenciales inválidas';
    } else if (exception instanceof QueryFailedError) {
      this.logger.debug('LOG 3');
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error en la consulta de base de datos';
    } else if (exception instanceof ValidationError) {
      this.logger.debug('LOG 4');
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Validación fallida';
    } else if (exception instanceof ConflictException) {
      this.logger.debug('LOG 5');
      statusCode = HttpStatus.CONFLICT;
      message = 'Conflicto';
    } else if (exception instanceof Error) {
      this.logger.debug('LOG 6');
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    } else {
      this.logger.debug('LOG 7');
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error desconocido';
    }

    if (
      !(exception instanceof UnauthorizedException) &&
      !(exception instanceof ForbiddenException)
    ) {
      this.logger.error({
        type: this.getErrorType(exception),
        error: exception,
      });
    }

    const body: any = {
      success: false,
      message,
      error: this.getErrorType(exception),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (details) body.details = details;

    return response.status(statusCode).json(body);
  }

  private getErrorType(exception: unknown): string {
    if (exception instanceof HttpException) {
      return `HTTP_${exception.constructor.name}`;
    }
    if (exception instanceof TypeORMError) {
      return 'TYPEORM_ERROR';
    }
    if (exception instanceof QueryFailedError) {
      return 'DATABASE_QUERY_ERROR';
    }
    if (exception instanceof ValidationError) {
      return 'VALIDATION_ERROR';
    }
    return 'UNKNOWN_ERROR';
  }
}
