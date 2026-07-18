export enum OrderStatusEnum {
  pending = 'pending',
  confirmed = 'confirmed',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName?: string;
  quantity: number;
  size: string;
  color: string;
  priceAtPurchase: number;
  discountPercentAtPurchase: number | null;
  effectivePriceAtPurchase: number;
}

export interface Order {
  id: number;
  userId: number;
  items?: OrderItem[];
  totalAmount: number;
  status: OrderStatusEnum;
  shippingAddress: string;
  phoneNumber: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
  size: string;
  color: string;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  shippingAddress: string;
  phoneNumber: string;
}

export interface QueryOrderDto {
  page?: number;
  limit?: number;
  status?: OrderStatusEnum;
}

export interface UpdateOrderStatusDto {
  status: OrderStatusEnum;
}
