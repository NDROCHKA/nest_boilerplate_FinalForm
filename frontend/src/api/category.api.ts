import { client } from './client';
import { Category, QueryCategoryDto } from '../types/category.types';
import { PaginatedResponse } from '../types/api.types';

export const categoryApi = {
  getAll: (query: QueryCategoryDto = {}): Promise<PaginatedResponse<Category>> => {
    return client.get<PaginatedResponse<Category>>('category', {
      page: query.page,
      limit: query.limit,
    });
  },

  getById: (id: number): Promise<Category> => {
    return client.get<Category>(`category/${id}`);
  },
};
