import { Expose } from 'class-transformer';
import { ProductImage } from './product-image';

export class Product {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  price: number;

  @Expose()
  discountPercent: number | null;

  @Expose()
  sizes: string[];

  @Expose()
  colors: string[];

  @Expose()
  stock: number;

  @Expose()
  isActive: boolean;

  @Expose()
  categoryId: number;

  @Expose()
  categoryName?: string;

  @Expose()
  images?: ProductImage[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date | null;

  /**
   * Computed field — the effective price after discount.
   * If discountPercent is set, effectivePrice = price - (price * discountPercent / 100)
   */
  @Expose()
  get effectivePrice(): number {
    if (this.discountPercent && this.discountPercent > 0) {
      return +(this.price - (this.price * this.discountPercent) / 100).toFixed(
        2,
      );
    }
    return +this.price;
  }
}
