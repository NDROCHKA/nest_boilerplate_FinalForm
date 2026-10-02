import {
  Column,
  Check,
  Entity,
  JoinColumn,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/infrastructure/product.entity';

@Entity({ name: 'order_item' })
@Check('CHK_order_item_quantity_positive', '"quantity" > 0')
@Check('CHK_order_item_price_nonnegative', '"priceAtPurchase" >= 0')
@Check(
  'CHK_order_item_discount_range',
  '"discountPercentAtPurchase" IS NULL OR "discountPercentAtPurchase" BETWEEN 0 AND 100',
)
@Index('IDX_order_item_order', ['orderId'])
@Index('IDX_order_item_product', ['productId'])
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_order_item' })
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'orderId',
    foreignKeyConstraintName: 'FK_order_item_order',
  })
  order: OrderEntity;

  @Column({ type: 'integer' })
  orderId: number;

  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'productId',
    foreignKeyConstraintName: 'FK_order_item_product',
  })
  product: ProductEntity;

  @Column({ type: 'integer' })
  productId: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'varchar', length: 50 })
  size: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  /** Snapshot of the product price at the time of purchase */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtPurchase: number;

  /** Snapshot of the discount percentage at the time of purchase */
  @Column({ type: 'integer', nullable: true, default: null })
  discountPercentAtPurchase: number | null;
}
