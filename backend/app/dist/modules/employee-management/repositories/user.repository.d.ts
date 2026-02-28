import { DataSource, EntityManager } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UserRepository extends Repository<User> {
    private dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    findById(id: string): Promise<User | null>;
    findByIdAndTenantId(id: string, tenantId: string): Promise<User | null>;
    findByTenant(tenantId: string): Promise<User[]>;
    findByUsernameAndTenant(username: string, tenantId: string): Promise<User | null>;
    findByUsernameAndCompanyUsername(username: string, company_username: string): Promise<User | null>;
    createUserWithRoles(createUserDto: CreateUserDto, hashedPassword: string, manager?: EntityManager): Promise<User>;
    UpdateUserWithRoles(user: User, updateUserDto: UpdateUserDto, hashedPassword?: string, manager?: EntityManager): Promise<User>;
    deleteUserWithRoles(id: string, manager?: EntityManager): Promise<boolean>;
}
