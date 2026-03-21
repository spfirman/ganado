import { DataSource, In, EntityManager } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../entities/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.findOne({
      where: { id },
      relations: ['roles'],
    });
    return user;
  }

  async findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<User | null> {
    try {
      const user = await this.findOne({ where: { id, tenantId } });
      return user;
    } catch (error) {
      this.logger.error('Error en la consulta:', error);
      throw new InternalServerErrorException(
        'Error al buscar el usuario por ID y tenantId',
      );
    }
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    try {
      const users = await this.find({ where: { tenantId } });
      return users;
    } catch (error) {
      this.logger.error('Error en la consulta:', error);
      throw new InternalServerErrorException(
        'Error al buscar usuarios por tenantId',
      );
    }
  }

  async findByUsernameAndTenant(
    username: string,
    tenantId: string,
  ): Promise<User | null> {
    const user = await this.findOne({
      where: { username, tenantId: tenantId },
      relations: ['roles'],
    });
    return user;
  }

  async findByUsernameAndCompanyUsername(
    username: string,
    company_username: string,
  ): Promise<User | null> {
    try {
      const queryBuilder = await this.createQueryBuilder('user')
        .innerJoinAndSelect('user.tenant', 'tenant')
        .leftJoinAndSelect(
          'user.roles',
          'roles',
          'roles.id IN (SELECT id_role FROM user_roles WHERE id_user = user.id)',
        )
        .where('user.username = :username', { username })
        .andWhere('tenant.company_username = :company_username', {
          company_username,
        })
        .andWhere('user.active = true');

      const sql = queryBuilder.getSql();
      const parameters = queryBuilder.getParameters();

      const user = await queryBuilder.getOne();
      return user || null;
    } catch (error) {
      this.logger.error('Error en la consulta:', error);
      if (error.code === '42P01') {
        throw new InternalServerErrorException('La tabla no existe');
      } else if (error.code === '42703') {
        throw new InternalServerErrorException(
          'Una columna referenciada no existe',
          { cause: error.message },
        );
      } else {
        throw new InternalServerErrorException('Database error', {
          cause: error.message,
        });
      }
    }
  }

  async createUserWithRoles(
    createUserDto: CreateUserDto,
    hashedPassword: string,
    manager?: EntityManager,
  ): Promise<User> {
    let queryRunner;
    if (!manager) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      manager = queryRunner.manager;
    }
    try {
      const roleIds = Array.isArray(createUserDto.roleIds)
        ? createUserDto.roleIds
        : [];

      if (roleIds.length > 0) {
        const existingRoles = await manager.find(Role, {
          where: { id: In(roleIds) },
        });
        if (existingRoles.length !== roleIds.length) {
          throw new BadRequestException('Some roles do not exist');
        }
      }

      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      const user = manager.create(User, userData);
      await manager.save(user);

      if (roleIds.length > 0) {
        const values = roleIds.map((roleId) => ({
          id_user: user.id,
          id_role: roleId,
        }));

        await manager
          .createQueryBuilder()
          .insert()
          .into('user_roles')
          .values(values)
          .execute();
      }

      if (queryRunner) {
        await queryRunner.commitTransaction();
      }

      return user;
    } catch (error) {
      this.logger.error('Error creating user with roles', error);
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }

  async UpdateUserWithRoles(
    user: User,
    updateUserDto: UpdateUserDto,
    hashedPassword?: string,
    manager?: EntityManager,
  ): Promise<User> {
    let queryRunner;
    if (!manager) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      manager = queryRunner.manager;
    }
    try {
      const userData: Partial<User> = {};
      if (updateUserDto.username) userData.username = updateUserDto.username;
      if (updateUserDto.firstName) userData.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName) userData.lastName = updateUserDto.lastName;
      if (updateUserDto.email) userData.email = updateUserDto.email;
      if (hashedPassword) userData.password = hashedPassword;
      if (updateUserDto.hasOwnProperty('active')) {
        userData.active = updateUserDto.active;
      }

      await manager.update(User, user.id, userData);

      if (updateUserDto.roleIds && updateUserDto.roleIds.length > 0) {
        const existingRoles = await manager.find(Role, {
          where: { id: In(updateUserDto.roleIds) },
        });
        if (existingRoles.length !== updateUserDto.roleIds.length) {
          throw new BadRequestException('Algunos roles no existen');
        }

        await manager
          .createQueryBuilder()
          .delete()
          .from('user_roles')
          .where('id_user = :userId', { userId: user.id })
          .execute();

        const values = updateUserDto.roleIds.map((roleId) => ({
          id_user: user.id,
          id_role: roleId,
        }));

        if (values.length > 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('user_roles')
            .values(values)
            .execute();
        }
      }

      const updatedUser = await manager.findOne(User, {
        where: { id: user.id },
        relations: ['roles'],
      });

      if (!updatedUser) {
        throw new BadRequestException('Error al actualizar el usuario');
      }

      if (queryRunner) {
        await queryRunner.commitTransaction();
      }

      return updatedUser;
    } catch (error) {
      this.logger.error('Error actualizando usuario con roles', error);
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }

  async deleteUserWithRoles(
    id: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    let queryRunner;
    if (!manager) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      manager = queryRunner.manager;
    }
    try {
      const user = await manager.findOne(User, {
        where: { id },
      });

      if (!user) {
        return false;
      }

      await manager
        .createQueryBuilder()
        .delete()
        .from('user_roles')
        .where('id_user = :userId', { userId: id })
        .execute();

      await manager.delete(User, id);

      if (queryRunner) {
        await queryRunner.commitTransaction();
      }

      return true;
    } catch (error) {
      this.logger.error('Error eliminando usuario con roles', error);
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }
}
