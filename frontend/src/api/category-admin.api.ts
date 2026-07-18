import { client } from './client';
import { Category, CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from '../types/category.types';
import { PaginatedResponse } from '../types/api.types';

export const categoryAdminApi = {
  create: (data: CreateCategoryDto): Promise<Category> => {
    return client.post<Category>('category-admin', data);
  },

  getAll: (query: QueryCategoryDto = {}): Promise<PaginatedResponse<Category>> => {
    return client.get<PaginatedResponse<Category>>('category-admin', {
      page: query.page,
      limit: query.limit,
    });
  },

  getById: (id: number): Promise<Category> => {
    return client.get<Category>(`category-admin/${id}`);
  },

  update: (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return client.patch<Category>(`category-admin/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return client.delete<void>(`category-admin/${id}`);
  },
};
