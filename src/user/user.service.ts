import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from './infrastructure/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { RoleEnum } from '../utils/enums/roles.enum';
import {
  UserEmailAlreadyExistsException,
  UserEmailNotProvidedException,
  UserNotFoundException,
  UserCannotRemoveOwnAdminAccessException,
} from './exceptions/user.exceptions';
import { User } from './domain/user';
import { InfinityPaginationWithTotalResultType } from '../utils/types/infinity-pagination-result.type';
import { infinityPaginationWithTotal } from '../utils/helpers';
import { QueryRunner } from 'typeorm';
import { RelationsAndSelectsOptions } from '../utils/types/relations-and-selects-options';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({
    createUserDto,
    queryRunner,
  }: {
    createUserDto: CreateUserDto;
    queryRunner?: QueryRunner;
  }): Promise<User> {
    if (!createUserDto.email) {
      throw new UserEmailNotProvidedException({ createUserDto });
    }

    const existing = await this.userRepository.findOne({
      fields: { email: createUserDto.email },
      queryRunner,
    });

    if (existing) {
      throw new UserEmailAlreadyExistsException({
        email: createUserDto.email,
      });
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.userRepository.create(
      {
        ...createUserDto,
        password: hashedPassword,
        emailVerified: false,
        tokenVersion: 0,
        role: RoleEnum.user,
      },
      queryRunner,
    );
  }

  async findManyWithPagination({
    query,
    queryRunner,
    relationsAndSelects,
  }: {
    query: QueryUserDto;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<{ data: User[]; totalCount: number }> {
    return this.userRepository.findManyWithPagination({
      query,
      queryRunner,
      relationsAndSelects,
    });
  }

  async findOne({
    id,
    queryRunner,
    relationsAndSelects,
  }: {
    id: number;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<User | null> {
    const user = await this.userRepository.findOne({
      fields: { id },
      queryRunner,
      relationsAndSelects,
    });

    return user;
  }

  async findOneByEmail({
    email,
    queryRunner,
    relationsAndSelects,
  }: {
    email: string;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<User | null> {
    return this.userRepository.findOne({
      fields: { email },
      queryRunner,
      relationsAndSelects,
    });
  }

  async update({
    id,
    updateUserDto,
    queryRunner,
  }: {
    id: number;
    updateUserDto: UpdateUserDto;
    queryRunner?: QueryRunner;
  }): Promise<User> {
    const user = await this.findOne({ id, queryRunner });

    if (!user) {
      throw new UserNotFoundException({ id });
    }

    const updated = await this.userRepository.update(
      id,
      updateUserDto,
      queryRunner,
    );
    if (!updated) {
      throw new UserNotFoundException({ id });
    }

    return updated;
  }

  async softDelete({
    id,
    actorUserId,
    queryRunner,
  }: {
    id: number;
    actorUserId?: number;
    queryRunner?: QueryRunner;
  }): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      fields: { id },
      queryRunner,
    });
    if (!existingUser) {
      throw new UserNotFoundException({ id });
    }

    if (
      existingUser.role === RoleEnum.superAdmin &&
      actorUserId === existingUser.id
    ) {
      throw new UserCannotRemoveOwnAdminAccessException();
    }

    await this.userRepository.softDelete({ id, queryRunner });
  }

  async updateRole({
    id,
    actorUserId,
    role,
    queryRunner,
  }: {
    id: number;
    actorUserId: number;
    role: RoleEnum;
    queryRunner?: QueryRunner;
  }): Promise<User> {
    const user = await this.findOne({ id, queryRunner });

    if (!user) {
      throw new UserNotFoundException({ id });
    }

    if (
      user.id === actorUserId &&
      user.role === RoleEnum.superAdmin &&
      role !== RoleEnum.superAdmin
    ) {
      throw new UserCannotRemoveOwnAdminAccessException();
    }

    const updated = await this.userRepository.update(id, { role }, queryRunner);
    if (!updated) {
      throw new UserNotFoundException({ id });
    }

    return updated;
  }

  async markEmailVerified({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<void> {
    await this.userRepository.update(id, { emailVerified: true }, queryRunner);
  }

  async resetPassword({
    id,
    password,
    queryRunner,
  }: {
    id: number;
    password: string;
    queryRunner?: QueryRunner;
  }): Promise<void> {
    const user = await this.findOne({ id, queryRunner });
    if (!user) {
      throw new UserNotFoundException({ id });
    }

    const hashedPassword = await this.hashPassword(password);
    await this.userRepository.update(
      id,
      {
        password: hashedPassword,
        tokenVersion: user.tokenVersion + 1,
      },
      queryRunner,
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
