import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './category.controller';
import { CategoryAdminController } from './category.admin.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './infrastructure/category.entity';
import { CategoryRepository } from './infrastructure/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
