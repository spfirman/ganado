import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
export declare class AllExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpException | TypeORMError, host: ArgumentsHost): any;
    private getErrorType;
}
