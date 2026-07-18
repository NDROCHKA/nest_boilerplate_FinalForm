import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../../product/infrastructure/product.entity';
import { ProductImageEntity } from '../../../../product/infrastructure/product-image.entity';
import { CategoryEntity } from '../../../../category/infrastructure/category.entity';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private imageRepository: Repository<ProductImageEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async run(): Promise<boolean> {
    let created = false;

    // Get category IDs
    const tshirts = await this.categoryRepository.findOne({
      where: { name: 'T-Shirts' },
    });
    const jackets = await this.categoryRepository.findOne({
      where: { name: 'Jackets' },
    });
    const pants = await this.categoryRepository.findOne({
      where: { name: 'Pants' },
    });
    const shoes = await this.categoryRepository.findOne({
      where: { name: 'Shoes' },
    });

    if (!tshirts || !jackets || !pants || !shoes) {
      console.log('Categories not found — run category seed first');
      return false;
    }

    const products = [
      {
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a relaxed fit. Perfect for everyday wear.',
        price: 29.99,
        discountPercent: null,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Gray'],
        stock: 100,
        isActive: true,
        categoryId: tshirts.id,
      },
      {
        name: 'Urban Street Jacket',
        description: 'Lightweight jacket with modern street-style design. Water-resistant.',
        price: 89.99,
        discountPercent: 15,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Olive'],
        stock: 50,
        isActive: true,
        categoryId: jackets.id,
      },
      {
        name: 'Slim Fit Chinos',
        description: 'Comfortable stretch chinos with a modern slim fit.',
        price: 49.99,
        discountPercent: null,
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Khaki', 'Navy', 'Black'],
        stock: 75,
        isActive: true,
        categoryId: pants.id,
      },
      {
        name: 'Running Sneakers Pro',
        description: 'High-performance running shoes with cushioned sole.',
        price: 119.99,
        discountPercent: 20,
        sizes: ['40', '41', '42', '43', '44', '45'],
        colors: ['White/Blue', 'Black/Red', 'Gray'],
        stock: 30,
        isActive: true,
        categoryId: shoes.id,
      },
      {
        name: 'Graphic Print T-Shirt',
        description: 'Bold graphic design on soft organic cotton.',
        price: 34.99,
        discountPercent: null,
        sizes: ['S', 'M', 'L'],
        colors: ['Black', 'White'],
        stock: 0,
        isActive: false, // Out of stock and inactive
        categoryId: tshirts.id,
      },
    ];

    for (const productData of products) {
      const existing = await this.productRepository.findOne({
        where: { name: productData.name },
        withDeleted: true,
      });

      if (!existing) {
        try {
          const saved = await this.productRepository.save(
            this.productRepository.create(productData),
          );
          created = true;
        } catch (error: any) {
          if (error?.code === '23505') {
            continue;
          }
          throw error;
        }
      }
    }

    return created;
  }
}
