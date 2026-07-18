import {
  Column,
  CreateDateColumn,
  Entity,
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
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'integer' })
  userId: number;

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
