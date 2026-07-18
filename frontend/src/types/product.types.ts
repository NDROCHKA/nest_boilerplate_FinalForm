export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
  productId: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discountPercent: number | null;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  categoryId: number;
  categoryName?: string;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  effectivePrice: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  discountPercent?: number;
  sizes: string[];
  colors: string[];
  stock: number;
  categoryId: number;
  imageUrls?: string[];
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  discountPercent?: number | null;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  categoryId?: number;
  imageUrls?: string[];
  isActive?: boolean;
}

export interface QueryProductDto {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}
