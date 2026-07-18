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

import { ProductService } from './product.service';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './domain/product';
import { ProductNotFoundException } from './exceptions/product.exceptions';

/**
 * PUBLIC Product Controller — No authentication required.
 * Anyone can browse products. Only active products are shown.
 */
@ApiTags('Product')
@Controller({ path: 'product', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryProductDto,
  ): Promise<{ data: Product[]; totalCount: number }> {
    return this.productService.findAll({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      search: query.search,
      onlyActive: true, // Public endpoint — only show active products
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productService.findOne({ id });

    if (!product || !product.isActive) {
      throw new ProductNotFoundException({ id });
    }

    return product;
  }
}
