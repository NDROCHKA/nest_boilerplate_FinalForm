import { Test } from '@nestjs/testing';
import { OrderService, ORDER_SHIPPING_FEE } from './order.service';
import { OrderRepository } from './infrastructure/order.repository';
import { ProductRepository } from '../product/infrastructure/product.repository';
import { UserRepository } from '../user/infrastructure/user.repository';
import { MailService } from '../mail/mail.service';
import { Product } from '../product/domain/product';
import { Order } from './domain/order';
import { OrderStatusEnum } from '../utils/enums/order-status.enum';
import { OrderInvalidStatusTransitionException } from './exceptions/order.exceptions';
import { ProductOutOfStockException } from '../product/exceptions/product.exceptions';

describe('OrderService', () => {
  const orderRepository = {
    acquireIdempotencyLock: jest.fn(),
    findByClientOrderId: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    findManyByUser: jest.fn(),
    findManyAll: jest.fn(),
  };
  const productRepository = {
    findOne: jest.fn(),
    decrementStockIfAvailable: jest.fn(),
    incrementStock: jest.fn(),
  };
  const userRepository = { findOne: jest.fn() };
  const mailService = {
    sendOrderConfirmed: jest.fn(),
    sendOrderDelivered: jest.fn(),
  };

  let service: OrderService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: orderRepository },
        { provide: ProductRepository, useValue: productRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();
    service = module.get(OrderService);
  });

  const makeProduct = (): Product =>
    Object.assign(new Product(), {
      id: 7,
      name: 'Armor Hoodie',
      description: null,
      price: 10.99,
      discountPercent: 10,
      sizes: ['M'],
      colors: ['Black'],
      stock: 5,
      isActive: true,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const createDto = {
    clientOrderId: '6200a4f1-5528-4b2f-911b-fcc4aa532c09',
    shippingAddress: 'Beirut, Lebanon',
    phoneNumber: '+96170123456',
    items: [{ productId: 7, quantity: 2, size: 'M', color: 'Black' }],
  };

  it('returns the existing order without touching stock on an idempotent retry', async () => {
    const existing = Object.assign(new Order(), {
      id: 11,
      userId: 3,
      clientOrderId: createDto.clientOrderId,
      items: [],
      totalAmount: 25,
      status: OrderStatusEnum.pending,
      shippingAddress: createDto.shippingAddress,
      phoneNumber: createDto.phoneNumber,
      paymentMethod: 'cash_on_delivery',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    orderRepository.findByClientOrderId.mockResolvedValue(existing);

    await expect(
      service.create({ userId: 3, createOrderDto: createDto }),
    ).resolves.toBe(existing);
    expect(orderRepository.acquireIdempotencyLock).toHaveBeenCalledWith(
      3,
      createDto.clientOrderId,
      undefined,
    );
    expect(productRepository.findOne).not.toHaveBeenCalled();
    expect(productRepository.decrementStockIfAvailable).not.toHaveBeenCalled();
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('uses integer-cent arithmetic and includes the shipping fee', async () => {
    const created = Object.assign(new Order(), { id: 12 });
    orderRepository.findByClientOrderId.mockResolvedValue(null);
    productRepository.findOne.mockResolvedValue(makeProduct());
    productRepository.decrementStockIfAvailable.mockResolvedValue(true);
    orderRepository.create.mockResolvedValue(created);

    await expect(
      service.create({ userId: 3, createOrderDto: createDto }),
    ).resolves.toBe(created);
    expect(orderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 3,
        clientOrderId: createDto.clientOrderId,
        totalAmount: 19.78 + ORDER_SHIPPING_FEE,
      }),
    );
  });

  it('fails when the guarded stock update loses a concurrency race', async () => {
    orderRepository.findByClientOrderId.mockResolvedValue(null);
    productRepository.findOne.mockResolvedValue(makeProduct());
    productRepository.decrementStockIfAvailable.mockResolvedValue(false);

    await expect(
      service.create({ userId: 3, createOrderDto: createDto }),
    ).rejects.toBeInstanceOf(ProductOutOfStockException);
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('restocks every item when a confirmed order is cancelled', async () => {
    const current = Object.assign(new Order(), {
      id: 21,
      status: OrderStatusEnum.confirmed,
      items: [
        { productId: 7, quantity: 2 },
        { productId: 8, quantity: 1 },
      ],
    });
    const cancelled = Object.assign(new Order(), {
      ...current,
      status: OrderStatusEnum.cancelled,
    });
    orderRepository.findOne.mockResolvedValue(current);
    orderRepository.updateStatus.mockResolvedValue(cancelled);

    await expect(
      service.updateStatus({ id: 21, status: OrderStatusEnum.cancelled }),
    ).resolves.toBe(cancelled);
    expect(productRepository.incrementStock).toHaveBeenNthCalledWith(
      1,
      7,
      2,
      undefined,
    );
    expect(productRepository.incrementStock).toHaveBeenNthCalledWith(
      2,
      8,
      1,
      undefined,
    );
  });

  it('rejects status jumps that skip fulfillment stages', async () => {
    orderRepository.findOne.mockResolvedValue(
      Object.assign(new Order(), {
        id: 22,
        status: OrderStatusEnum.pending,
        items: [],
      }),
    );

    await expect(
      service.updateStatus({ id: 22, status: OrderStatusEnum.delivered }),
    ).rejects.toBeInstanceOf(OrderInvalidStatusTransitionException);
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });
});
