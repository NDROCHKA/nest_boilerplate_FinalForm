import { Injectable } from '@nestjs/common';

import { ProductRepository } from './infrastructure/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './domain/product';
import { ProductNotFoundException } from './exceptions/product.exceptions';
import { CategoryNotFoundException } from '../category/exceptions/category.exceptions';
import { CategoryService } from '../category/category.service';
import { QueryRunner } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create({
    createProductDto,
    queryRunner,
  }: {
    createProductDto: CreateProductDto;
    queryRunner?: QueryRunner;
  }): Promise<Product> {
    // Validate category exists
    const category = await this.categoryService.findOne({
      id: createProductDto.categoryId,
      queryRunner,
    });

    if (!category) {
      throw new CategoryNotFoundException({
        categoryId: createProductDto.categoryId,
      });
    }

    return this.productRepository.create(
      {
        name: createProductDto.name,
        description: createProductDto.description || null,
        price: createProductDto.price,
        discountPercent: createProductDto.discountPercent || null,
        sizes: createProductDto.sizes,
        colors: createProductDto.colors,
        stock: createProductDto.stock,
        isActive: createProductDto.isActive ?? true,
        categoryId: createProductDto.categoryId,
      },
      createProductDto.imageUrls,
      queryRunner,
    );
  }

  async findAll({
    page,
    limit,
    categoryId,
    search,
    onlyActive = false,
    queryRunner,
  }: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    onlyActive?: boolean;
    queryRunner?: QueryRunner;
  }): Promise<{ data: Product[]; totalCount: number }> {
    return this.productRepository.findManyWithPagination({
      page,
      limit,
      categoryId,
      search,
      onlyActive,
      queryRunner,
    });
  }

  async findOne({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<Product | null> {
    return this.productRepository.findOne({
      fields: { id },
      queryRunner,
    });
  }

  async update({
    id,
    updateProductDto,
    queryRunner,
  }: {
    id: number;
    updateProductDto: UpdateProductDto;
    queryRunner?: QueryRunner;
  }): Promise<Product> {
    const product = await this.findOne({ id, queryRunner });

    if (!product) {
      throw new ProductNotFoundException({ id });
    }

    // Validate category if being changed
    if (
      updateProductDto.categoryId &&
      updateProductDto.categoryId !== product.categoryId
    ) {
      const category = await this.categoryService.findOne({
        id: updateProductDto.categoryId,
        queryRunner,
      });

      if (!category) {
        throw new CategoryNotFoundException({
          categoryId: updateProductDto.categoryId,
        });
      }
    }

    // Extract imageUrls from DTO — handle separately from entity update
    const { imageUrls, ...entityPayload } = updateProductDto;

    // Update product fields
    const updated = await this.productRepository.update(
      id,
      entityPayload,
      queryRunner,
    );

    if (!updated) {
      throw new ProductNotFoundException({ id });
    }

    // Replace images if new ones provided
    if (imageUrls !== undefined) {
      await this.productRepository.replaceImages(id, imageUrls, queryRunner);
    }

    // Re-fetch to get complete data with images
    return this.findOne({ id, queryRunner }) as Promise<Product>;
  }

  async toggleActive({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<Product> {
    const product = await this.findOne({ id, queryRunner });

    if (!product) {
      throw new ProductNotFoundException({ id });
    }

    const updated = await this.productRepository.update(
      id,
      { isActive: !product.isActive },
      queryRunner,
    );

    if (!updated) {
      throw new ProductNotFoundException({ id });
    }

    return updated;
  }

  async softDelete({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<void> {
    const product = await this.findOne({ id, queryRunner });

    if (!product) {
      throw new ProductNotFoundException({ id });
    }

    await this.productRepository.softDelete({ id, queryRunner });
  }
}
