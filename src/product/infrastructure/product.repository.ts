import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';

import { Product } from '../domain/product';
import { ProductEntity } from './product.entity';
import { ProductImageEntity } from './product-image.entity';
import { NullableType } from '../../utils/types/nullable.type';
import { ProductMapper } from './product.mapper';
import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';
import { addRelationsAndSelects } from '../../utils/queryRunner/add-relations-and-selects';
import {
  productFindManyDefault,
  productFindOneDefault,
} from './relations-and-selects-options';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly imageRepository: Repository<ProductImageEntity>,
  ) {}

  private getRepository(queryRunner?: QueryRunner): Repository<ProductEntity> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(ProductEntity);
    }
    return this.repository;
  }

  private getImageRepository(
    queryRunner?: QueryRunner,
  ): Repository<ProductImageEntity> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(ProductImageEntity);
    }
    return this.imageRepository;
  }

  async create(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'effectivePrice' | 'categoryName' | 'images'>,
    imageUrls?: string[],
    queryRunner?: QueryRunner,
  ): Promise<Product> {
    const repository = this.getRepository(queryRunner);
    const entity = repository.create(
      ProductMapper.toPersistence(data as Product),
    );
    const saved = await repository.save(entity);

    // Create images if provided
    if (imageUrls && imageUrls.length > 0) {
      const imageRepo = this.getImageRepository(queryRunner);
      const images = imageUrls.map((url, index) =>
        imageRepo.create({
          url,
          sortOrder: index,
          productId: saved.id,
        }),
      );
      await imageRepo.save(images);
    }

    // Re-fetch with relations to return complete product
    return this.findOne({
      fields: { id: saved.id },
      queryRunner,
    }) as Promise<Product>;
  }

  async findManyWithPagination({
    page,
    limit,
    categoryId,
    search,
    onlyActive = false,
    queryRunner,
    relationsAndSelects = productFindManyDefault,
  }: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    onlyActive?: boolean;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<{ data: Product[]; totalCount: number }> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('product');

    queryBuilder = await addRelationsAndSelects(
      queryBuilder,
      relationsAndSelects,
    );

    // Filter by active status for public endpoints
    if (onlyActive) {
      queryBuilder.andWhere('product.isActive = :isActive', {
        isActive: true,
      });
    }

    // Filter by category
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId,
      });
    }

    // Search by name or description
    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('product.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: entities.map((entity) => ProductMapper.toDomain(entity)),
      totalCount,
    };
  }

  async findOne({
    fields,
    queryRunner,
    relationsAndSelects = productFindOneDefault,
  }: {
    fields: { id?: number; name?: string };
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<NullableType<Product>> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('product');

    queryBuilder = await addRelationsAndSelects(
      queryBuilder,
      relationsAndSelects,
    );

    if (fields.id) {
      queryBuilder.andWhere('product.id = :id', { id: fields.id });
    }

    if (fields.name) {
      queryBuilder.andWhere('product.name = :name', { name: fields.name });
    }

    const entity = await queryBuilder.getOne();
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async update(
    id: number,
    payload: DeepPartial<ProductEntity>,
    queryRunner?: QueryRunner,
  ): Promise<Product | null> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.preload({ id, ...payload });

    if (!entity) {
      return null;
    }

    const saved = await repository.save(entity);

    // Re-fetch with relations
    return this.findOne({ fields: { id: saved.id }, queryRunner });
  }

  async replaceImages(
    productId: number,
    imageUrls: string[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const imageRepo = this.getImageRepository(queryRunner);

    // Delete existing images
    await imageRepo.delete({ productId });

    // Create new images
    if (imageUrls.length > 0) {
      const images = imageUrls.map((url, index) =>
        imageRepo.create({
          url,
          sortOrder: index,
          productId,
        }),
      );
      await imageRepo.save(images);
    }
  }

  async softDelete({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }

  async decrementStock(
    productId: number,
    quantity: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository
      .createQueryBuilder()
      .update(ProductEntity)
      .set({ stock: () => `stock - ${quantity}` })
      .where('id = :id', { id: productId })
      .execute();
  }
}
