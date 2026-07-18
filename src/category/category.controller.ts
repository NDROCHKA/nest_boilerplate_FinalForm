import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Category } from './domain/category';
import { CategoryNotFoundException } from './exceptions/category.exceptions';

/**
 * PUBLIC Category Controller — No authentication required.
 * Anyone (guest or logged-in user) can browse categories.
 */
@ApiTags('Category')
@Controller({ path: 'category', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
}
