import { Repository, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RoleService } from './roles.service';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../repositories/user.repository';
import { ApplicationPermissionsService } from '../../../common/application-permissions/application-permissions.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly userCustomRepository;
    private readonly rolesRepository;
    private readonly rolesService;
    private readonly applicationPermissionsService;
    private readonly logger;
    constructor(userRepository: Repository<User>, userCustomRepository: UserRepository, rolesRepository: Repository<Role>, rolesService: RoleService, applicationPermissionsService: ApplicationPermissionsService);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findOne(id: string, sessionUser: SessionUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, sessionUser: SessionUserDto): Promise<UserResponseDto>;
    remove(id: string, sessionUser: SessionUserDto): Promise<void>;
    findByTenant(tenantId: string): Promise<User[]>;
    findAll(tenantId: string): Promise<User[]>;
    findWithPagination(tenantId: string, page?: number, limit?: number, filters?: {
        username?: string;
        lastName?: string;
    }): Promise<{
        items: UserResponseDto[];
        total: number;
    }>;
    findByUsernameAndPasswordAndCompanyUsername(username: string, password: string, company_username: string): Promise<User | null>;
    getHashedPassword(password: string): Promise<string>;
    findByUsername(username: string, tenantId: string): Promise<User | undefined>;
    validateUser(username: string, password: string, tenantId: string): Promise<UserResponseDto | undefined>;
    createAdminUser(dto: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
        tenantId: string;
    }, manager?: EntityManager): Promise<UserResponseDto>;
}
