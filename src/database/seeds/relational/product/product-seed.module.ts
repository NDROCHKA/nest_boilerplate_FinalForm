import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSeedService } from './product-seed.service';
import { ProductEntity } from '../../../../product/infrastructure/product.entity';
import { ProductImageEntity } from '../../../../product/infrastructure/product-image.entity';
import { CategoryEntity } from '../../../../category/infrastructure/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity, CategoryEntity]),
  ],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
