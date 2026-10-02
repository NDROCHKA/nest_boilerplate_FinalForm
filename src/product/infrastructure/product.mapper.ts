import { Product } from '../domain/product';
import { ProductImage } from '../domain/product-image';
import { ProductEntity } from './product.entity';
import { ProductImageEntity } from './product-image.entity';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const product = new Product();
    product.id = entity.id;
    product.name = entity.name;
    product.description = entity.description;
    product.price = Number(entity.price);
    product.discountPercent = entity.discountPercent;
    product.sizes = entity.sizes || [];
    product.colors = entity.colors || [];
    product.stock = entity.stock;
    product.isActive = entity.isActive;
    product.categoryId = entity.categoryId;
    product.createdAt = entity.createdAt;
    product.updatedAt = entity.updatedAt;
    product.deletedAt = entity.deletedAt;

    // Map category name if loaded
    if (entity.category) {
      product.categoryName = entity.category.name;
    }

    // Map images if loaded
    if (entity.images) {
      product.images = entity.images.map((img) =>
        ProductMapper.imageToDomain(img),
      );
    }

    return product;
  }

  static toPersistence(
    product: Pick<
      Product,
      | 'name'
      | 'description'
      | 'price'
      | 'discountPercent'
      | 'sizes'
      | 'colors'
      | 'stock'
      | 'isActive'
      | 'categoryId'
    > &
      Partial<Pick<Product, 'id'>>,
  ): ProductEntity {
    const entity = new ProductEntity();

    if (product.id !== undefined) {
      entity.id = product.id;
    }

    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price;
    entity.discountPercent = product.discountPercent;
    entity.sizes = product.sizes;
    entity.colors = product.colors;
    entity.stock = product.stock;
    entity.isActive = product.isActive;
    entity.categoryId = product.categoryId;

    return entity;
  }

  static imageToDomain(entity: ProductImageEntity): ProductImage {
    const image = new ProductImage();
    image.id = entity.id;
    image.url = entity.url;
    image.sortOrder = entity.sortOrder;
    image.productId = entity.productId;
    image.createdAt = entity.createdAt;
    return image;
  }
}
