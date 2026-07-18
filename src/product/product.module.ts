import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductAdminController } from './product.admin.controller';
import { ProductService } from './product.service';
import { ProductEntity } from './infrastructure/product.entity';
import { ProductImageEntity } from './infrastructure/product-image.entity';
import { ProductRepository } from './infrastructure/product.repository';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    CategoryModule, // Needed to validate category existence when creating products
  ],
  controllers: [ProductController, ProductAdminController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
