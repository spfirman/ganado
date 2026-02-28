export declare class SessionUserDto {
    username: string;
    sub: string;
    tenant_id: string;
    date: string;
    permissionsHash: string;
    permissions: Record<string, Record<string, string>>;
    sessionId: string;
}
