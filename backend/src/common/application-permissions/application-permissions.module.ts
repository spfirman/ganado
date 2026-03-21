import { Module } from '@nestjs/common';
import { RedisModule } from '../../modules/auth/redis/redis.module';
import { ApplicationPermissionsService } from './application-permissions.service';
import { ApplicationPermissionsGuard } from './application-permissions.guard';

@Module({
  imports: [RedisModule],
  providers: [ApplicationPermissionsService, ApplicationPermissionsGuard],
  exports: [ApplicationPermissionsService, ApplicationPermissionsGuard],
})
export class ApplicationPermissionsModule {}
