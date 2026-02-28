import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    active?: boolean;
    roleIds?: string[];
}
export {};
