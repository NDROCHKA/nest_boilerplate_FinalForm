import { client } from './client';
import { Order, QueryOrderDto, OrderStatusEnum } from '../types/order.types';
import { PaginatedResponse } from '../types/api.types';

export const orderAdminApi = {
  getAll: (query: QueryOrderDto = {}): Promise<PaginatedResponse<Order>> => {
    return client.get<PaginatedResponse<Order>>('order-admin', {
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
  },

  getById: (id: number): Promise<Order> => {
    return client.get<Order>(`order-admin/${id}`);
  },

  updateStatus: (id: number, status: OrderStatusEnum): Promise<Order> => {
    return client.patch<Order>(`order-admin/${id}/status`, { status });
  },
};
