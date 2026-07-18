import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';

export const categoryFindManyDefault: RelationsAndSelectsOptions = {
  select: [
    'category.id',
    'category.name',
    'category.description',
    'category.imageUrl',
    'category.createdAt',
    'category.updatedAt',
    'category.deletedAt',
  ],
  joins: [],
};

export const categoryFindOneDefault: RelationsAndSelectsOptions = {
  select: [
    'category.id',
    'category.name',
    'category.description',
    'category.imageUrl',
    'category.createdAt',
    'category.updatedAt',
    'category.deletedAt',
  ],
  joins: [],
};
