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
        name: 'T-Shirts',
        description: 'Casual and formal t-shirts for all occasions',
        imageUrl: null,
      },
      {
        name: 'Jackets',
        description: 'Warm and stylish jackets for every season',
        imageUrl: null,
      },
      {
        name: 'Pants',
        description: 'Comfortable pants and trousers',
        imageUrl: null,
      },
      {
        name: 'Shoes',
        description: 'Footwear for every style',
        imageUrl: null,
      },
      {
        name: 'Accessories',
        description: 'Hats, belts, bags, and more',
        imageUrl: null,
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
      }
    }

    return created;
  }
}
