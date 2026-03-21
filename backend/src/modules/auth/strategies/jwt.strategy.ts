import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../employee-management/services/users.service';
import { ApplicationPermissionsService } from '../../../common/application-permissions/application-permissions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly permissionsService: ApplicationPermissionsService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET no está configurado en las variables de entorno',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException();
    }

    const sessionData = await this.permissionsService.getSessionFromRedis(
      payload.sub,
      payload.sessionId,
    );

    if (!sessionData) {
      throw new UnauthorizedException('Session expired or invalid.');
    }

    if (sessionData.permissionsHash !== payload.permissionsHash) {
      throw new UnauthorizedException(
        'Permissions outdated. Please refresh your session.',
      );
    }

    return sessionData;
  }
}
