import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApplicationPermissionsService } from './application-permissions.service';
export declare class ApplicationPermissionsGuard implements CanActivate {
    private reflector;
    private applicationPermissionsService;
    private readonly logger;
    constructor(reflector: Reflector, applicationPermissionsService: ApplicationPermissionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
