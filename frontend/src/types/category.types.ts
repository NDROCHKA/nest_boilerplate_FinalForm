export interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface QueryCategoryDto {
  page?: number;
  limit?: number;
}
