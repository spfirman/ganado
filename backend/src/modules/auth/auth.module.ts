import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeeManagementModule } from '../employee-management/employee-management.module';
import { ApplicationPermissionsService } from '../../common/application-permissions/application-permissions.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from '../../common/filters/all-exception.filter';
import { ApplicationPermissionsModule } from '../../common/application-permissions/application-permissions.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    EmployeeManagementModule,
    ApplicationPermissionsModule,
    RedisModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ApplicationPermissionsService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, ApplicationPermissionsService],
})
export class AuthModule {}
