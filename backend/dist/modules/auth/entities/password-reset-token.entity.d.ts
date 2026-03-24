import { User } from '../../employee-management/entities/user.entity';
export declare class PasswordResetToken {
    id: string;
    userId: string;
    user: User;
    tokenHash: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
