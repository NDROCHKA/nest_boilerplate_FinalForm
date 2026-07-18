export enum RoleEnum {
  user = 1,
  superAdmin = 2,
}

export interface User {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture?: string | null;
  emailVerified: boolean;
  role: RoleEnum;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateUserDto {
  email: string;
  phoneNumber: string;
  password?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
}

export interface UpdateUserDto {
  email?: string;
  phoneNumber?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
}

export interface QueryUserDto {
  page?: number;
  limit?: number;
  filters?: {
    name?: string;
    email?: string;
  } | null;
  sort?: Array<{
    orderBy?: keyof User;
    order?: 'ASC' | 'DESC';
  }> | null;
}
