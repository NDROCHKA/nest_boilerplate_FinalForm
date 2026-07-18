import { Order } from '../domain/order';
import { OrderItem } from '../domain/order-item';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    const order = new Order();
    order.id = entity.id;
    order.userId = entity.userId;
    order.totalAmount = Number(entity.totalAmount);
    order.status = entity.status;
    order.shippingAddress = entity.shippingAddress;
    order.phoneNumber = entity.phoneNumber;
    order.paymentMethod = entity.paymentMethod;
    order.createdAt = entity.createdAt;
    order.updatedAt = entity.updatedAt;

    if (entity.items) {
      order.items = entity.items.map((item) =>
        OrderMapper.itemToDomain(item),
      );
    }

    return order;
  }

  static itemToDomain(entity: OrderItemEntity): OrderItem {
    const item = new OrderItem();
    item.id = entity.id;
    item.orderId = entity.orderId;
    item.productId = entity.productId;
    item.quantity = entity.quantity;
    item.size = entity.size;
    item.color = entity.color;
    item.priceAtPurchase = Number(entity.priceAtPurchase);
    item.discountPercentAtPurchase = entity.discountPercentAtPurchase;

    // Map product name if loaded
    if (entity.product) {
      item.productName = entity.product.name;
    }

    return item;
  }
}
