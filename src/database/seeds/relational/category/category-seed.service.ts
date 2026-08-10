import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../../category/infrastructure/category.entity';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {}

  async run(): Promise<boolean> {
    let created = false;

    const categories = [
      {
        name: 'Oversized T-Shirts',
        description: 'Heavyweight cotton tees crafted with dropped shoulders and a relaxed streetwear silhouette',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Regular Fit T-Shirts',
        description: 'Classic tailored athletic cotton tees built for true-to-size everyday comfort',
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Hoodies & Outerwear',
        description: 'Heavyweight fleece hoodies and jackets engineered for warmth and modern luxury',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'T-Shirts',
        description: 'Casual, oversized, and premium heavy-cotton tees for everyday style',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Jackets',
        description: 'Warm, stylish urban jackets, bombers, and streetwear outerwear',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Pants',
        description: 'Modern slim chinos, relaxed cargo pants, and designer denim',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Shoes',
        description: 'Performance running sneakers, minimalist trainers, and high-tops',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Accessories',
        description: 'Designer streetwear caps, premium leather bags, watches, and sunglasses',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Activewear',
        description: 'High-performance athletic apparel, gym hoodies, and breathable shorts',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      },
    ];

    for (const categoryData of categories) {
      const existing = await this.repository.findOne({
        where: { name: categoryData.name },
        withDeleted: true,
      });

      if (!existing) {
        try {
          await this.repository.save(this.repository.create(categoryData));
          created = true;
        } catch (error: any) {
          if (error?.code === '23505') {
            continue;
          }
          throw error;
        }
      } else if (!existing.imageUrl || existing.imageUrl !== categoryData.imageUrl) {
        // Update image URL if missing or outdated
        existing.imageUrl = categoryData.imageUrl;
        existing.description = categoryData.description;
        await this.repository.save(existing);
        created = true;
      }
    }

    return created;
  }
}
