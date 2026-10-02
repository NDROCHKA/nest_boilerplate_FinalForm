import { Expose } from 'class-transformer';
import { OrderStatusEnum } from '../../utils/enums/order-status.enum';
import { OrderItem } from './order-item';

export class Order {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  clientOrderId: string;

  @Expose()
  items?: OrderItem[];

  @Expose()
  totalAmount: number;

  @Expose()
  status: OrderStatusEnum;

  @Expose()
  shippingAddress: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
