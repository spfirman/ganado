export declare class WeighingAuditLog {
    id: string;
    idTenant: string;
    weighingId: string;
    fieldChanged: string;
    oldValue: string | null;
    newValue: string | null;
    changedBy: string;
    changedAt: Date;
}
