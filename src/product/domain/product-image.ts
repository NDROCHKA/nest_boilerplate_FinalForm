import { Expose } from 'class-transformer';

export class ProductImage {
  @Expose()
  id: number;

  @Expose()
  url: string;

  @Expose()
  sortOrder: number;

  @Expose()
  productId: number;

  @Expose()
  createdAt: Date;
}
