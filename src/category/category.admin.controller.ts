import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Category } from './domain/category';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/roles.enum';
import { CategoryNotFoundException } from './exceptions/category.exceptions';
import { TransactionQueryRunner } from '../utils/decorators/transaction-query-runner.decorator';
import { QueryRunnerInterceptor } from '../utils/interceptors/query-runner.interceptor';
import type { QueryRunner } from 'typeorm';

/**
 * ADMIN Category Controller — Super Admin only.
 * Full CRUD operations on categories.
 */
@UseInterceptors(QueryRunnerInterceptor)
@ApiTags('Category Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.superAdmin)
@Controller({ path: 'category-admin', version: '1' })
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Category> {
    return this.categoryService.create({ createCategoryDto, queryRunner });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryCategoryDto,
  ): Promise<{ data: Category[]; totalCount: number }> {
    return this.categoryService.findAll({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoryService.findOne({ id });

    if (!category) {
      throw new CategoryNotFoundException({ id });
    }

    return category;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Category> {
    return this.categoryService.update({ id, updateCategoryDto, queryRunner });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<void> {
    await this.categoryService.softDelete({ id, queryRunner });
  }
}
