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

    const oversizedTees = await this.categoryRepository.findOne({
      where: { name: 'Oversized T-Shirts' },
    });
    const regularTees = await this.categoryRepository.findOne({
      where: { name: 'Regular Fit T-Shirts' },
    });
    const hoodiesOuterwear = await this.categoryRepository.findOne({
      where: { name: 'Hoodies & Outerwear' },
    });
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
    const accessories = await this.categoryRepository.findOne({
      where: { name: 'Accessories' },
    });
    const activewear = await this.categoryRepository.findOne({
      where: { name: 'Activewear' },
    });

    const productsList = [
      // ── OVERSIZED T-SHIRTS ──
      {
        name: 'Crown & Thorn Oversized Heavyweight Tee',
        description:
          '500GSM ultra-heavyweight combed cotton with drop-shoulder streetwear cut, vintage garment wash, and embroidered crown of thorns.',
        price: 45.0,
        discountPercent: 10,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Washed Black', 'Vintage Olive', 'Off-White'],
        stock: 100,
        isActive: true,
        categoryId: oversizedTees?.id || tshirts?.id || 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Crusader Emblem Boxy Fit Tee',
        description:
          'Boxy oversized fit featuring high-density puff print emblem on back and thick 1.25" rib collar.',
        price: 48.0,
        discountPercent: null,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Parchment White', 'Charcoal Smoke'],
        stock: 75,
        isActive: true,
        categoryId: oversizedTees?.id || tshirts?.id || 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Faith & Valor Heavy Cotton Oversized Tee',
        description:
          'Pre-shrunk 100% organic cotton oversized tee with reinforced twin needle stitching and dropped shoulders.',
        price: 42.0,
        discountPercent: 15,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Raw Ochre', 'Deep Maroon', 'Pitch Black'],
        stock: 60,
        isActive: true,
        categoryId: oversizedTees?.id || tshirts?.id || 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
        ],
      },

      // ── REGULAR FIT T-SHIRTS ──
      {
        name: 'Signature Cedar Crest Athletic Tee',
        description:
          'Classic tailored athletic fit tee in ring-spun combed cotton with soft-hand Cedar silhouette chest print.',
        price: 34.0,
        discountPercent: null,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Navy Blue', 'Forest Green'],
        stock: 120,
        isActive: true,
        categoryId: regularTees?.id || tshirts?.id || 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Crusader Core Crewneck Tee',
        description:
          'Essential daily wear cotton crewneck tee with true-to-size cut and side-seam construction.',
        price: 32.0,
        discountPercent: 10,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Pure White', 'Heather Gray', 'Midnight Black'],
        stock: 90,
        isActive: true,
        categoryId: regularTees?.id || tshirts?.id || 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        ],
      },

      // ── HOODIES & OUTERWEAR ──
      {
        name: 'Armor of Faith Heavyweight Fleece Hoodie',
        description:
          '480GSM French Terry heavyweight fleece pullover hoodie with double-lined hood, hidden phone pouch, and high-density chest embroidery.',
        price: 78.0,
        discountPercent: 10,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Washed Charcoal', 'Crimson Red', 'Olive Green'],
        stock: 80,
        isActive: true,
        categoryId: hoodiesOuterwear?.id || jackets?.id || 2,
        imageUrls: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Crusader Fortress Zip-Up Fleece Hoodie',
        description:
          'Heavyweight full-zip fleece hoodie equipped with custom gunmetal hardware, deep kangaroo pockets, and fleece-lined hood.',
        price: 85.0,
        discountPercent: 15,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Jet Black', 'Heather Gray'],
        stock: 65,
        isActive: true,
        categoryId: hoodiesOuterwear?.id || jackets?.id || 2,
        imageUrls: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Urban Street Flight Bomber Jacket',
        description:
          'Insulated nylon flight bomber jacket equipped with utility arm pocket, heavy-duty metal zippers, and ribbed waist cuffs.',
        price: 129.99,
        discountPercent: 20,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Matte Black', 'Olive Drab'],
        stock: 50,
        isActive: true,
        categoryId: hoodiesOuterwear?.id || jackets?.id || 2,
        imageUrls: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        ],
      },

      // ── PANTS, SHOES & ACCESSORIES ──
      {
        name: 'Tactical Multi-Pocket Cargo Pants',
        description:
          'Reinforced ripstop cotton cargo pants with expandable flap pockets and cinchable ankle cuffs.',
        price: 74.99,
        discountPercent: 25,
        sizes: ['30', '32', '34', '36'],
        colors: ['Tactical Black', 'Desert Sand', 'Army Green'],
        stock: 55,
        isActive: true,
        categoryId: pants?.id || 3,
        imageUrls: [
          'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Pro Runner Air Cushion Sneakers',
        description:
          'Engineered mesh athletic running shoes featuring high-rebound air cushioning and non-slip rubber traction sole.',
        price: 139.99,
        discountPercent: 15,
        sizes: ['40', '41', '42', '43', '44'],
        colors: ['Crimson Red/Black', 'Pure White/Cobalt', 'Triple Black'],
        stock: 80,
        isActive: true,
        categoryId: shoes?.id || 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Chronograph Matte Black Timepiece',
        description:
          'Precision Japanese quartz movement timepiece with scratch-resistant sapphire glass and stainless steel mesh strap.',
        price: 189.0,
        discountPercent: 20,
        sizes: ['One Size'],
        colors: ['Matte Black', 'Silver Stainless'],
        stock: 25,
        isActive: true,
        categoryId: accessories?.id || 5,
        imageUrls: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        ],
      },
    ];

    for (const item of productsList) {
      const { imageUrls, ...productData } = item;

      let productEntity = await this.productRepository.findOne({
        where: { name: productData.name },
        relations: ['images'],
        withDeleted: true,
      });

      if (!productEntity) {
        try {
          productEntity = await this.productRepository.save(
            this.productRepository.create(productData),
          );
          created = true;
        } catch (error: unknown) {
          if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
          ) {
            continue;
          }
          throw error;
        }
      }

      // Attach image entities if product has no images yet or missing photos
      if (productEntity && imageUrls && imageUrls.length > 0) {
        const existingImages = await this.imageRepository.find({
          where: { productId: productEntity.id },
        });

        if (existingImages.length === 0) {
          const imageEntities = imageUrls.map((url, index) =>
            this.imageRepository.create({
              url,
              sortOrder: index,
              productId: productEntity.id,
            }),
          );
          await this.imageRepository.save(imageEntities);
          created = true;
        }
      }
    }

    return created;
  }
}
