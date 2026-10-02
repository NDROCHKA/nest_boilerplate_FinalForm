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

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './domain/product';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/roles.enum';
import { ProductNotFoundException } from './exceptions/product.exceptions';
import { TransactionQueryRunner } from '../utils/decorators/transaction-query-runner.decorator';
import { QueryRunnerInterceptor } from '../utils/interceptors/query-runner.interceptor';
import type { QueryRunner } from 'typeorm';

/**
 * ADMIN Product Controller — Super Admin only.
 * Full CRUD on products: create, update, toggle, delete, set discounts.
 */
@ApiTags('Product Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.superAdmin)
@Controller({ path: 'product-admin', version: '1' })
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Product> {
    return this.productService.create({ createProductDto, queryRunner });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryProductDto,
  ): Promise<{ data: Product[]; totalCount: number }> {
    // Admin can see ALL products (active + inactive)
    return this.productService.findAll({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      search: query.search,
      onlyActive: false,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productService.findOne({ id });

    if (!product) {
      throw new ProductNotFoundException({ id });
    }

    return product;
  }

  @Patch(':id')
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Product> {
    return this.productService.update({ id, updateProductDto, queryRunner });
  }

  @Patch(':id/toggle')
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.OK)
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Product> {
    return this.productService.toggleActive({ id, queryRunner });
  }

  @Delete(':id')
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<void> {
    await this.productService.softDelete({ id, queryRunner });
  }
}
