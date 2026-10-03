import { Injectable, Logger } from '@nestjs/common';

import { OrderRepository } from './infrastructure/order.repository';
import { ProductRepository } from '../product/infrastructure/product.repository';
import { UserRepository } from '../user/infrastructure/user.repository';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './domain/order';
import { OrderStatusEnum } from '../utils/enums/order-status.enum';
import {
  OrderNotFoundException,
  OrderInvalidStatusTransitionException,
} from './exceptions/order.exceptions';
import {
  ProductNotFoundException,
  ProductNotActiveException,
  ProductOutOfStockException,
  InvalidProductSizeException,
  InvalidProductColorException,
} from '../product/exceptions/product.exceptions';
import { QueryRunner } from 'typeorm';

export const ORDER_SHIPPING_FEE = 4;

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  /**
   * Place a new order — the core business logic:
   * 1. Validate all products exist and are active
   * 2. Validate selected sizes and colors
   * 3. Check stock availability
   * 4. Snapshot prices and discounts
   * 5. Decrement stock
   * 6. Calculate total
   * 7. Create order with status = pending, paymentMethod = cash_on_delivery
   */
  async create({
    userId,
    createOrderDto,
    queryRunner,
  }: {
    userId: number;
    createOrderDto: CreateOrderDto;
    queryRunner?: QueryRunner;
  }): Promise<Order> {
    await this.orderRepository.acquireIdempotencyLock(
      userId,
      createOrderDto.clientOrderId,
      queryRunner,
    );

    const existingOrder = await this.orderRepository.findByClientOrderId({
      userId,
      clientOrderId: createOrderDto.clientOrderId,
      queryRunner,
    });
    if (existingOrder) {
      return existingOrder;
    }

    const orderItems: Array<{
      productId: number;
      quantity: number;
      size: string;
      color: string;
      priceAtPurchase: number;
      discountPercentAtPurchase: number | null;
    }> = [];

    let subtotalInCents = 0;

    // Validate each item
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        fields: { id: item.productId },
        queryRunner,
      });

      if (!product) {
        throw new ProductNotFoundException({ productId: item.productId });
      }

      if (!product.isActive) {
        throw new ProductNotActiveException({
          productId: item.productId,
          productName: product.name,
        });
      }

      // Validate size
      if (!product.sizes.includes(item.size)) {
        throw new InvalidProductSizeException({
          productId: item.productId,
          requestedSize: item.size,
          availableSizes: product.sizes,
        });
      }

      // Validate color
      if (!product.colors.includes(item.color)) {
        throw new InvalidProductColorException({
          productId: item.productId,
          requestedColor: item.color,
          availableColors: product.colors,
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        throw new ProductOutOfStockException({
          productId: item.productId,
          productName: product.name,
          requested: item.quantity,
          available: product.stock,
        });
      }

      // Calculate effective price (with discount)
      const effectivePrice =
        product.discountPercent && product.discountPercent > 0
          ? +(
              product.price -
              (product.price * product.discountPercent) / 100
            ).toFixed(2)
          : +product.price;

      // Add to total
      subtotalInCents += Math.round(effectivePrice * 100) * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        priceAtPurchase: product.price,
        discountPercentAtPurchase: product.discountPercent,
      });
    }

    // Decrement stock for all items
    for (const item of createOrderDto.items) {
      const decremented =
        await this.productRepository.decrementStockIfAvailable(
          item.productId,
          item.quantity,
          queryRunner,
        );

      if (!decremented) {
        throw new ProductOutOfStockException({
          productId: item.productId,
          requested: item.quantity,
        });
      }
    }

    // Create the order
    return this.orderRepository.create({
      userId,
      clientOrderId: createOrderDto.clientOrderId,
      totalAmount: subtotalInCents / 100 + ORDER_SHIPPING_FEE,
      shippingAddress: createOrderDto.shippingAddress,
      phoneNumber: createOrderDto.phoneNumber,
      items: orderItems,
      queryRunner,
    });
  }

  async findUserOrders({
    userId,
    page,
    limit,
    queryRunner,
  }: {
    userId: number;
    page?: number;
    limit?: number;
    queryRunner?: QueryRunner;
  }): Promise<{ data: Order[]; totalCount: number }> {
    return this.orderRepository.findManyByUser({
      userId,
      page,
      limit,
      queryRunner,
    });
  }

  async findUserOrder({
    id,
    userId,
    queryRunner,
  }: {
    id: number;
    userId: number;
    queryRunner?: QueryRunner;
  }): Promise<Order | null> {
    return this.orderRepository.findOne({
      id,
      userId,
      queryRunner,
    });
  }

  async findAllOrders({
    page,
    limit,
    status,
    queryRunner,
  }: {
    page?: number;
    limit?: number;
    status?: OrderStatusEnum;
    queryRunner?: QueryRunner;
  }): Promise<{ data: Order[]; totalCount: number }> {
    return this.orderRepository.findManyAll({
      page,
      limit,
      status,
      queryRunner,
    });
  }

  async findOneAdmin({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<Order | null> {
    return this.orderRepository.findOne({ id, queryRunner });
  }

  async updateStatus({
    id,
    status,
    queryRunner,
  }: {
    id: number;
    status: OrderStatusEnum;
    queryRunner?: QueryRunner;
  }): Promise<Order> {
    const order = await this.orderRepository.findOne({ id, queryRunner });

    if (!order) {
      throw new OrderNotFoundException({ id });
    }

    // Validate status transition
    const validTransitions: Record<string, OrderStatusEnum[]> = {
      [OrderStatusEnum.pending]: [
        OrderStatusEnum.confirmed,
        OrderStatusEnum.cancelled,
      ],
      [OrderStatusEnum.confirmed]: [
        OrderStatusEnum.delivered,
        OrderStatusEnum.cancelled,
      ],
      [OrderStatusEnum.delivered]: [], // Terminal state
      [OrderStatusEnum.cancelled]: [], // Terminal state
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new OrderInvalidStatusTransitionException({
        currentStatus: order.status,
        requestedStatus: status,
        allowedStatuses: allowed,
      });
    }

    const updated = await this.orderRepository.updateStatus(
      id,
      status,
      order.status,
      queryRunner,
    );

    if (!updated) {
      throw new OrderNotFoundException({ id });
    }

    if (status === OrderStatusEnum.cancelled) {
      for (const item of order.items ?? []) {
        await this.productRepository.incrementStock(
          item.productId,
          item.quantity,
          queryRunner,
        );
      }
    }

    return updated;
  }

  async sendStatusNotification(
    orderId: number,
    status: OrderStatusEnum,
  ): Promise<void> {
    const fullOrder = await this.orderRepository.findOne({ id: orderId });
    if (!fullOrder || !fullOrder.userId) return;

    const user = await this.userRepository.findOne({
      fields: { id: fullOrder.userId },
    });

    const userEmail = user?.email;
    const userName = user?.firstName || undefined;

    if (!userEmail) return;

    if (status === OrderStatusEnum.confirmed) {
      await this.mailService.sendOrderConfirmed(userEmail, orderId, userName);
    } else if (status === OrderStatusEnum.delivered) {
      await this.mailService.sendOrderDelivered(userEmail, orderId, userName);
    }
  }
}
