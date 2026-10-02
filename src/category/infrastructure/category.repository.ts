import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';

import { Category } from '../domain/category';
import { CategoryEntity } from './category.entity';
import { NullableType } from '../../utils/types/nullable.type';
import { CategoryMapper } from './category.mapper';
import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';
import { addRelationsAndSelects } from '../../utils/queryRunner/add-relations-and-selects';
import {
  categoryFindManyDefault,
  categoryFindOneDefault,
} from './relations-and-selects-options';
import { EntityCondition } from '../../utils/types/entity-condition.type';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  private getRepository(queryRunner?: QueryRunner): Repository<CategoryEntity> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(CategoryEntity);
    }
    return this.repository;
  }

  async create(
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    queryRunner?: QueryRunner,
  ): Promise<Category> {
    const repository = this.getRepository(queryRunner);
    const entity = repository.create(CategoryMapper.toPersistence(data));
    const saved = await repository.save(entity);
    return CategoryMapper.toDomain(saved);
  }

  async findManyWithPagination({
    page,
    limit,
    queryRunner,
    relationsAndSelects = categoryFindManyDefault,
  }: {
    page?: number;
    limit?: number;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<{ data: Category[]; totalCount: number }> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('category');

    queryBuilder = addRelationsAndSelects(queryBuilder, relationsAndSelects);

    queryBuilder.orderBy('category.name', 'ASC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: entities.map((entity) => CategoryMapper.toDomain(entity)),
      totalCount,
    };
  }

  async findOne({
    fields,
    queryRunner,
    relationsAndSelects = categoryFindOneDefault,
  }: {
    fields: EntityCondition<Category>;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<NullableType<Category>> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('category');

    queryBuilder = addRelationsAndSelects(queryBuilder, relationsAndSelects);

    if (fields.id) {
      queryBuilder.andWhere('category.id = :id', { id: fields.id });
    }

    if (fields.name) {
      queryBuilder.andWhere('category.name = :name', { name: fields.name });
    }

    const entity = await queryBuilder.getOne();
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async update(
    id: number,
    payload: DeepPartial<Category>,
    queryRunner?: QueryRunner,
  ): Promise<Category | null> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.preload({ id, ...payload });

    if (!entity) {
      return null;
    }

    const saved = await repository.save(entity);
    return CategoryMapper.toDomain(saved);
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
}
