import {
  Column,
  Check,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/infrastructure/user.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusEnum } from '../../utils/enums/order-status.enum';

@Entity({ name: 'order' })
@Check('CHK_order_total_nonnegative', '"totalAmount" >= 0')
@Check(
  'CHK_order_status',
  `"status" IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')`,
)
@Check('CHK_order_payment_method', `"paymentMethod" IN ('cash_on_delivery')`)
@Index('UQ_order_user_client_order_id', ['userId', 'clientOrderId'], {
  unique: true,
})
@Index('IDX_order_user_created', ['userId', 'createdAt'])
@Index('IDX_order_status_created', ['status', 'createdAt'])
export class OrderEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_order' })
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_order_user' })
  user: UserEntity;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'uuid' })
  clientOrderId: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
    eager: false,
  })
  items: OrderItemEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: OrderStatusEnum.pending,
  })
  status: OrderStatusEnum;

  @Column({ type: 'text' })
  shippingAddress: string;

  @Column({ type: 'varchar', length: 32 })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'cash_on_delivery',
  })
  paymentMethod: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
