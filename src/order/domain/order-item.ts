import { Expose } from 'class-transformer';

export class OrderItem {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  productId: number;

  @Expose()
  productName?: string;

  @Expose()
  quantity: number;

  @Expose()
  size: string;

  @Expose()
  color: string;

  @Expose()
  priceAtPurchase: number;

  @Expose()
  discountPercentAtPurchase: number | null;

  /**
   * Computed — the effective price per unit after discount at purchase time.
   */
  @Expose()
  get effectivePriceAtPurchase(): number {
    if (this.discountPercentAtPurchase && this.discountPercentAtPurchase > 0) {
      return +(
        this.priceAtPurchase -
        (this.priceAtPurchase * this.discountPercentAtPurchase) / 100
      ).toFixed(2);
    }
    return +this.priceAtPurchase;
  }
}
