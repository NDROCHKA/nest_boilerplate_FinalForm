import { Injectable } from '@nestjs/common';

import { CategoryRepository } from './infrastructure/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './domain/category';
import {
  CategoryNotFoundException,
  CategoryNameAlreadyExistsException,
} from './exceptions/category.exceptions';
import { QueryRunner } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create({
    createCategoryDto,
    queryRunner,
  }: {
    createCategoryDto: CreateCategoryDto;
    queryRunner?: QueryRunner;
  }): Promise<Category> {
    // Check for duplicate name
    const existing = await this.categoryRepository.findOne({
      fields: { name: createCategoryDto.name },
      queryRunner,
    });

    if (existing) {
      throw new CategoryNameAlreadyExistsException({
        name: createCategoryDto.name,
      });
    }

    return this.categoryRepository.create(
      {
        name: createCategoryDto.name,
        description: createCategoryDto.description || null,
        imageUrl: createCategoryDto.imageUrl || null,
      },
      queryRunner,
    );
  }

  async findAll({
    page,
    limit,
    queryRunner,
  }: {
    page?: number;
    limit?: number;
    queryRunner?: QueryRunner;
  }): Promise<{ data: Category[]; totalCount: number }> {
    return this.categoryRepository.findManyWithPagination({
      page,
      limit,
      queryRunner,
    });
  }

  async findOne({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<Category | null> {
    return this.categoryRepository.findOne({
      fields: { id },
      queryRunner,
    });
  }

  async update({
    id,
    updateCategoryDto,
    queryRunner,
  }: {
    id: number;
    updateCategoryDto: UpdateCategoryDto;
    queryRunner?: QueryRunner;
  }): Promise<Category> {
    const category = await this.findOne({ id, queryRunner });

    if (!category) {
      throw new CategoryNotFoundException({ id });
    }

    // Check for duplicate name if name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        fields: { name: updateCategoryDto.name },
        queryRunner,
      });

      if (existing) {
        throw new CategoryNameAlreadyExistsException({
          name: updateCategoryDto.name,
        });
      }
    }

    const updated = await this.categoryRepository.update(
      id,
      updateCategoryDto,
      queryRunner,
    );

    if (!updated) {
      throw new CategoryNotFoundException({ id });
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
    const category = await this.findOne({ id, queryRunner });

    if (!category) {
      throw new CategoryNotFoundException({ id });
    }

    await this.categoryRepository.softDelete({ id, queryRunner });
  }
}
