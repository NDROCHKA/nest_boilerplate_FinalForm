import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/infrastructure/product.entity';

@Entity({ name: 'order_item' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column({ type: 'integer' })
  orderId: number;

  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
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
