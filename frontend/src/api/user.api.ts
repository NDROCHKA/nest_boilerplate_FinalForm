import { client } from './client';
import { User, UpdateUserDto } from '../types/user.types';

export const userApi = {
  getMe: (): Promise<User> => {
    return client.get<User>('user');
  },
  updateMe: (data: UpdateUserDto): Promise<User> => {
    return client.patch<User>('user', data);
  },
  deleteMe: (): Promise<void> => {
    return client.delete<void>('user');
  },
};
