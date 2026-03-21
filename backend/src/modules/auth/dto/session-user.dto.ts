export class SessionUserDto {
  username: string;
  sub: string;
  tenant_id: string;
  date: string;
  permissionsHash: string;
  permissions: any;
  sessionId: string;
}
