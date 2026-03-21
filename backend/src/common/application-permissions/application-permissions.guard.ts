import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApplicationPermissionsService } from './application-permissions.service';

@Injectable()
export class ApplicationPermissionsGuard implements CanActivate {
  private readonly logger = new Logger(ApplicationPermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly applicationPermissionsService: ApplicationPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenUser = request.user;

    this.logger.debug('User from request:', tokenUser);

    if (!tokenUser || !tokenUser.sub) {
      throw new UnauthorizedException('User not authenticated');
    }


    let module =
      this.reflector.get<string>('requireModule', context.getHandler());
    if (!module) {
      module = this.reflector.get<string>('requireModule', context.getClass());
    }

    let entity =
      this.reflector.get<string>('requireEntity', context.getHandler());
    if (!entity) {
      entity = this.reflector.get<string>('requireEntity', context.getClass());
    }

    const action = this.reflector.get<string>(
      'requireAction',
      context.getHandler(),
    );

    this.logger.debug('Permission check:', { module, entity, action });

    if (!module || !entity || !action) {
      throw new ForbiddenException('Not Authorized');
    }

    // Hard-coded permission restrictions
    if (
      entity === 'roles' &&
      (action === 'create' || action === 'update' || action === 'delete')
    ) {
      throw new ForbiddenException('Not Authorized');
    }

    if (
      entity === 'modules' &&
      (action === 'create' || action === 'update' || action === 'delete')
    ) {
      throw new ForbiddenException('Not Authorized');
    }

    if (entity === 'tenants' && action === 'create') {
      return true;
    }

    if (entity === 'tenants' && action === 'list') {
      return false;
    }

    const redisSessionData =
      await this.applicationPermissionsService.getSessionFromRedis(
        tokenUser.sub,
        tokenUser.sessionId,
      );

    if (!redisSessionData) {
      throw new ForbiddenException('No permissions found');
    }

    if (redisSessionData.permissionsHash !== tokenUser.permissionsHash) {
      throw new ForbiddenException('Invalid permissions');
    }

    if (!redisSessionData.permissions) {
      throw new ForbiddenException('No permissions found');
    }

    const hasAccess =
      await this.applicationPermissionsService.canAccessModuleEntity(
        module,
        entity,
        action,
        redisSessionData.permissions,
      );

    if (!hasAccess) {
      // Self-update exception: users can update their own profile
      if (
        entity === 'users' &&
        action === 'update' &&
        tokenUser.sub === request.params.id
      ) {
        const restrictedFields = ['roleIds', 'tenantId', 'active'];
        const updateData = request.body;
        const hasRestrictedFields = restrictedFields.some((field) =>
          updateData.hasOwnProperty(field),
        );

        if (!hasRestrictedFields) {
          return true;
        }

        throw new ForbiddenException(
          'No tienes permisos para modificar estos campos: roleIds, tenantId, active',
        );
      } else {
        throw new ForbiddenException(`Access denied this action`);
      }
    }

    return true;
  }
}
