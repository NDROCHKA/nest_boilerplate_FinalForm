import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFindOneUser } from './swagger/find-one-user.swagger';
import { ApiUpdateUser } from './swagger/update-user.swagger';
import { ApiDeleteUser } from './swagger/delete-user.swagger';
import { User } from './domain/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserNotFoundException } from './exceptions/user.exceptions';
import { TransactionQueryRunner } from '../utils/decorators/transaction-query-runner.decorator';
import { QueryRunnerInterceptor } from '../utils/interceptors/query-runner.interceptor';
import type { QueryRunner } from 'typeorm';
import { GetUser } from '../utils/decorators/getUser.decorator';

@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Registration has been moved to AuthController (POST /auth/email/register)
  // This controller now only handles authenticated user operations.

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiFindOneUser()
  async findOne(
    @GetUser() userId: number,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<User> {
    const user = await this.userService.findOne({ id: userId, queryRunner });

    if (!user) {
      throw new UserNotFoundException({ id: userId });
    }

    return user;
  }

  @Patch()
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUpdateUser()
  async update(
    @GetUser() userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<User> {
    return this.userService.update({ id: userId, updateUserDto, queryRunner });
  }

  @Delete()
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiDeleteUser()
  async remove(
    @GetUser() userId: number,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<void> {
    await this.userService.softDelete({
      id: userId,
      actorUserId: userId,
      queryRunner,
    });
  }
}
