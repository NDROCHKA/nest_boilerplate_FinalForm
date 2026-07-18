import { client } from './client';
import { Product, QueryProductDto } from '../types/product.types';
import { PaginatedResponse } from '../types/api.types';

export const productApi = {
  getAll: (query: QueryProductDto = {}): Promise<PaginatedResponse<Product>> => {
    return client.get<PaginatedResponse<Product>>('product', {
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      search: query.search,
    });
  },

  getById: (id: number): Promise<Product> => {
    return client.get<Product>(`product/${id}`);
  },
};
