import { Expose, Exclude } from 'class-transformer';
import { Tenant } from '../entities/tenant.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  tenantId: string;

  @Expose()
  tenant: Tenant;

  @Expose()
  roles: any[];

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
