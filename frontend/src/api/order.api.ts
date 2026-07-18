import { client } from './client';
import { Order, CreateOrderDto, QueryOrderDto } from '../types/order.types';
import { PaginatedResponse } from '../types/api.types';

export const orderApi = {
  create: (data: CreateOrderDto): Promise<Order> => {
    return client.post<Order>('order', data);
  },

  getMyOrders: (query: QueryOrderDto = {}): Promise<PaginatedResponse<Order>> => {
    return client.get<PaginatedResponse<Order>>('order', {
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
  },

  getMyOrderById: (id: number): Promise<Order> => {
    return client.get<Order>(`order/${id}`);
  },
};
