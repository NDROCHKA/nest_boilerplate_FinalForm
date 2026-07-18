import { client } from './client';
import { Product, CreateProductDto, UpdateProductDto, QueryProductDto } from '../types/product.types';
import { PaginatedResponse } from '../types/api.types';

export const productAdminApi = {
  create: (data: CreateProductDto): Promise<Product> => {
    return client.post<Product>('product-admin', data);
  },

  getAll: (query: QueryProductDto = {}): Promise<PaginatedResponse<Product>> => {
    return client.get<PaginatedResponse<Product>>('product-admin', {
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      search: query.search,
    });
  },

  getById: (id: number): Promise<Product> => {
    return client.get<Product>(`product-admin/${id}`);
  },

  update: (id: number, data: UpdateProductDto): Promise<Product> => {
    return client.patch<Product>(`product-admin/${id}`, data);
  },

  toggleActive: (id: number): Promise<Product> => {
    return client.patch<Product>(`product-admin/${id}/toggle`);
  },

  delete: (id: number): Promise<void> => {
    return client.delete<void>(`product-admin/${id}`);
  },
};
