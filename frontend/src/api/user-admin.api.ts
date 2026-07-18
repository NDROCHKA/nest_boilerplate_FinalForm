import { client } from './client';
import { User, UpdateUserDto, QueryUserDto, RoleEnum } from '../types/user.types';
import { PaginatedResponse } from '../types/api.types';

export const userAdminApi = {
  getAll: (query: QueryUserDto = {}): Promise<PaginatedResponse<User>> => {
    const params: Record<string, any> = {
      page: query.page || 1,
      limit: query.limit || 10,
    };

    if (query.filters) {
      params.filters = JSON.stringify(query.filters);
    }
    if (query.sort) {
      params.sort = JSON.stringify(query.sort);
    }

    return client.get<PaginatedResponse<User>>('user-admin', params);
  },

  getById: (id: number): Promise<User> => {
    return client.get<User>(`user-admin/${id}`);
  },

  update: (id: number, data: UpdateUserDto): Promise<User> => {
    return client.patch<User>(`user-admin/${id}`, data);
  },

  updateRole: (id: number, role: RoleEnum): Promise<User> => {
    return client.patch<User>(`user-admin/${id}/role`, { role });
  },

  delete: (id: number): Promise<void> => {
    return client.delete<void>(`user-admin/${id}`);
  },
};
