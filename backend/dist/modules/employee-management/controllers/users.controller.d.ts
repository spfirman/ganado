import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { SessionUserDto } from 'src/modules/auth/dto/session-user.dto';
import { RoleService } from '../services/roles.service';
export declare class UsersController {
    private readonly usersService;
    private readonly rolesService;
    constructor(usersService: UsersService, rolesService: RoleService);
    create(sessionUser: SessionUserDto, createUserDto: CreateUserDto): Promise<UserResponseDto>;
    getRoles(sessionUser: SessionUserDto): Promise<import("../dto/role-read.dto").RoleReadDto[]>;
    findOne(sessionUser: SessionUserDto, id: string): Promise<UserResponseDto>;
    update(sessionUser: SessionUserDto, id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    delete(sessionUser: SessionUserDto, id: string): Promise<void>;
    list(sessionUser: SessionUserDto, page: number, limit: number, username?: string, lastName?: string): Promise<{
        items: UserResponseDto[];
        total: number;
    }>;
}
