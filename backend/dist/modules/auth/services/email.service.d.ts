export declare class EmailService {
    private readonly logger;
    private ses;
    private fromAddress;
    private appName;
    constructor();
    sendPasswordReset(to: string, token: string, resetUrl: string): Promise<void>;
    sendPasscode(to: string, code: string): Promise<void>;
    private send;
    private passwordResetTemplate;
    private passcodeTemplate;
}
