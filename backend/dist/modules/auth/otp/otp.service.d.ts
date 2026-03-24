import { DataSource } from 'typeorm';
export declare class OtpService {
    private dataSource;
    private readonly logger;
    private appName;
    constructor(dataSource: DataSource);
    setup(userId: string, userEmail: string): Promise<{
        qrCodeUrl: string;
        secret: string;
        backupCodes: string[];
    }>;
    verifySetup(userId: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyLogin(userId: string, code: string): Promise<boolean>;
    disable(userId: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    isEnabled(userId: string): Promise<boolean>;
    getStatus(userId: string): Promise<{
        isEnabled: any;
        backupCodesRemaining: any;
    }>;
    private getOtpRecord;
}
