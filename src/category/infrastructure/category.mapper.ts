import { Category } from '../domain/category';
import { CategoryEntity } from './category.entity';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category {
    const category = new Category();
    category.id = entity.id;
    category.name = entity.name;
    category.description = entity.description;
    category.imageUrl = entity.imageUrl;
    category.createdAt = entity.createdAt;
    category.updatedAt = entity.updatedAt;
    category.deletedAt = entity.deletedAt;
    return category;
  }

  static toPersistence(category: Category): CategoryEntity {
    const entity = new CategoryEntity();
    if (category.id !== undefined) {
      entity.id = category.id;
    }
    entity.name = category.name;
    entity.description = category.description;
    entity.imageUrl = category.imageUrl;
    return entity;
  }
}
