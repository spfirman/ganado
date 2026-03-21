import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RoleService } from './roles.service';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../repositories/user.repository';
import { ApplicationPermissionsService } from '../../../common/application-permissions/application-permissions.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCustomRepository: UserRepository,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly rolesService: RoleService,
    private readonly applicationPermissionsService: ApplicationPermissionsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const savedUser = await this.userCustomRepository.createUserWithRoles(
      createUserDto,
      hashedPassword,
    );
    return plainToInstance(UserResponseDto, savedUser);
  }

  async findOne(id: string, sessionUser: SessionUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        tenantId: sessionUser.tenant_id,
      },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    sessionUser: SessionUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userCustomRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isOwnUser = sessionUser.sub === id;
    if (!isOwnUser && sessionUser.tenant_id !== user.tenantId) {
      throw new ForbiddenException(
        'No tienes permisos para modificar este usuario',
      );
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser =
        await this.userCustomRepository.findByUsernameAndTenant(
          updateUserDto.username,
          sessionUser.tenant_id,
        );
      if (existingUser) {
        throw new ConflictException('El nombre de usuario ya esta en uso');
      }
    }

    if (updateUserDto.tenantId) {
      throw new ForbiddenException(
        'No se permite modificar el tenant de un usuario',
      );
    }

    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await this.getHashedPassword(updateUserDto.password);
      delete updateUserDto.password;
    }

    const updatedUser = await this.userCustomRepository.UpdateUserWithRoles(
      user,
      updateUserDto,
      hashedPassword,
    );
    return plainToInstance(UserResponseDto, updatedUser);
  }

  async remove(id: string, sessionUser: SessionUserDto): Promise<void> {
    const user = await this.userCustomRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isOwnUser = sessionUser.sub === id;
    if (!isOwnUser) {
      if (sessionUser.tenant_id !== user.tenantId) {
        throw new ForbiddenException(
          'No tienes permisos para eliminar este usuario',
        );
      }
    }

    const deleted = await this.userCustomRepository.deleteUserWithRoles(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { tenantId: tenantId },
      relations: ['roles'],
    });
    return users;
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userCustomRepository.find({
      where: { tenantId: tenantId },
      relations: ['roles', 'roles.permissions', 'roles.permissions.module'],
    });
  }

  async findWithPagination(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
    filters: { username?: string; lastName?: string } = {},
  ): Promise<{ items: UserResponseDto[]; total: number }> {
    const { username, lastName } = filters;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.tenantId = :tenantId', { tenantId });

    if (username) {
      query.andWhere('LOWER(user.username) LIKE :username', {
        username: `%${username.toLowerCase()}%`,
      });
    }

    if (lastName) {
      query.andWhere('LOWER(user.lastName) LIKE :lastName', {
        lastName: `%${lastName.toLowerCase()}%`,
      });
    }

    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.username', 'ASC');

    const [users, total] = await query.getManyAndCount();

    return {
      items: users.map((user) =>
        plainToInstance(UserResponseDto, user),
      ),
      total,
    };
  }

  async findByUsernameAndPasswordAndCompanyUsername(
    username: string,
    password: string,
    company_username: string,
  ): Promise<User | null> {
    try {
      const user_db =
        await this.userCustomRepository.findByUsernameAndCompanyUsername(
          username,
          company_username,
        );

      if (!user_db) {
        throw new UnauthorizedException('Credenciales invalidas');
        return null;
      }

      var user: User | null = null;
      const isPasswordValid = await bcrypt.compare(password, user_db.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales invalidas');
      }

      user = plainToInstance(User, user_db);
      return user;
    } catch (error) {
      this.logger.error(
        'Error en findByUsernameAndPasswordAndCompanyUsername:',
        error,
      );
      throw error;
    }
  }

  getHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async findByUsername(
    username: string,
    tenantId: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { username, tenantId: tenantId },
      relations: ['roles', 'tenant'],
    });
    return user || undefined;
  }

  async validateUser(
    username: string,
    password: string,
    tenantId: string,
  ): Promise<UserResponseDto | undefined> {
    const user = await this.findByUsername(username, tenantId);
    if (user && (await bcrypt.compare(password, user.password))) {
      return plainToInstance(UserResponseDto, user);
    }
    return undefined;
  }

  async createAdminUser(
    dto: {
      username: string;
      password: string;
      email: string;
      firstName: string;
      lastName: string;
      tenantId: string;
    },
    manager?: EntityManager,
  ): Promise<UserResponseDto> {
    const userRepository = manager
      ? manager.getRepository(User)
      : this.userRepository;

    const where = [
      { username: dto.username, tenantId: dto.tenantId },
      { email: dto.email, tenantId: dto.tenantId },
    ];

    const existingUser = await userRepository.findOne({ where });
    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con ese username o email en este tenant',
      );
    }

    const adminRole = await this.rolesService.findByCode('SYS_ADMIN');
    if (!adminRole) {
      throw new NotFoundException('Admin role not found');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = userRepository.create({
      username: dto.username,
      password: hashedPassword,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      tenantId: dto.tenantId,
      roles: [adminRole],
    });

    const savedUser = await userRepository.save(user);
    return plainToInstance(UserResponseDto, savedUser);
  }
}
