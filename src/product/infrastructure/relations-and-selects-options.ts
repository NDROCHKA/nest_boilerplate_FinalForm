import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';

export const productFindManyDefault: RelationsAndSelectsOptions = {
  select: [
    'product.id',
    'product.name',
    'product.description',
    'product.price',
    'product.discountPercent',
    'product.sizes',
    'product.colors',
    'product.stock',
    'product.isActive',
    'product.categoryId',
    'product.createdAt',
    'product.updatedAt',
    'product.deletedAt',
    'category.id',
    'category.name',
    'image.id',
    'image.url',
    'image.sortOrder',
    'image.productId',
    'image.createdAt',
  ],
  joins: [
    { propertyPath: 'product.category', alias: 'category', joinType: 'left' },
    { propertyPath: 'product.images', alias: 'image', joinType: 'left' },
  ],
};

export const productFindOneDefault: RelationsAndSelectsOptions = {
  select: [
    'product.id',
    'product.name',
    'product.description',
    'product.price',
    'product.discountPercent',
    'product.sizes',
    'product.colors',
    'product.stock',
    'product.isActive',
    'product.categoryId',
    'product.createdAt',
    'product.updatedAt',
    'product.deletedAt',
    'category.id',
    'category.name',
    'image.id',
    'image.url',
    'image.sortOrder',
    'image.productId',
    'image.createdAt',
  ],
  joins: [
    { propertyPath: 'product.category', alias: 'category', joinType: 'left' },
    { propertyPath: 'product.images', alias: 'image', joinType: 'left' },
  ],
};
