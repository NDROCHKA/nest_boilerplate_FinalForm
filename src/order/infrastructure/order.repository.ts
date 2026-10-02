import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { Order } from '../domain/order';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { NullableType } from '../../utils/types/nullable.type';
import { OrderMapper } from './order.mapper';
import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';
import { addRelationsAndSelects } from '../../utils/queryRunner/add-relations-and-selects';
import {
  orderFindManyDefault,
  orderFindOneDefault,
} from './relations-and-selects-options';
import { OrderStatusEnum } from '../../utils/enums/order-status.enum';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepository: Repository<OrderItemEntity>,
  ) {}

  private getRepository(queryRunner?: QueryRunner): Repository<OrderEntity> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(OrderEntity);
    }
    return this.repository;
  }

  private getItemRepository(
    queryRunner?: QueryRunner,
  ): Repository<OrderItemEntity> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(OrderItemEntity);
    }
    return this.itemRepository;
  }

  async create({
    userId,
    clientOrderId,
    totalAmount,
    shippingAddress,
    phoneNumber,
    items,
    queryRunner,
  }: {
    userId: number;
    clientOrderId: string;
    totalAmount: number;
    shippingAddress: string;
    phoneNumber: string;
    items: Array<{
      productId: number;
      quantity: number;
      size: string;
      color: string;
      priceAtPurchase: number;
      discountPercentAtPurchase: number | null;
    }>;
    queryRunner?: QueryRunner;
  }): Promise<Order> {
    const repository = this.getRepository(queryRunner);
    const itemRepository = this.getItemRepository(queryRunner);

    // Create order
    const orderEntity = repository.create({
      userId,
      clientOrderId,
      totalAmount,
      shippingAddress,
      phoneNumber,
      status: OrderStatusEnum.pending,
      paymentMethod: 'cash_on_delivery',
    });

    const savedOrder = await repository.save(orderEntity);

    // Create order items
    const orderItems = items.map((item) =>
      itemRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );
    await itemRepository.save(orderItems);

    // Re-fetch with relations
    const order = await this.findOne({
      id: savedOrder.id,
      queryRunner,
    });
    if (!order) {
      throw new Error('Created order could not be reloaded');
    }
    return order;
  }

  async acquireIdempotencyLock(
    userId: number,
    clientOrderId: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    if (!queryRunner) return;

    await queryRunner.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      `order:${userId}:${clientOrderId}`,
    ]);
  }

  async findByClientOrderId({
    userId,
    clientOrderId,
    queryRunner,
  }: {
    userId: number;
    clientOrderId: string;
    queryRunner?: QueryRunner;
  }): Promise<Order | null> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('order');
    queryBuilder = addRelationsAndSelects(queryBuilder, orderFindOneDefault);
    queryBuilder
      .andWhere('order.userId = :userId', { userId })
      .andWhere('order.clientOrderId = :clientOrderId', { clientOrderId });

    const entity = await queryBuilder.getOne();
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findManyByUser({
    userId,
    page,
    limit,
    queryRunner,
    relationsAndSelects = orderFindManyDefault,
  }: {
    userId: number;
    page?: number;
    limit?: number;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<{ data: Order[]; totalCount: number }> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('order');

    queryBuilder = addRelationsAndSelects(queryBuilder, relationsAndSelects);

    queryBuilder.andWhere('order.userId = :userId', { userId });
    queryBuilder.orderBy('order.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: entities.map((entity) => OrderMapper.toDomain(entity)),
      totalCount,
    };
  }

  async findManyAll({
    page,
    limit,
    status,
    queryRunner,
    relationsAndSelects = orderFindManyDefault,
  }: {
    page?: number;
    limit?: number;
    status?: OrderStatusEnum;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<{ data: Order[]; totalCount: number }> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('order');

    queryBuilder = addRelationsAndSelects(queryBuilder, relationsAndSelects);

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    queryBuilder.orderBy('order.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: entities.map((entity) => OrderMapper.toDomain(entity)),
      totalCount,
    };
  }

  async findOne({
    id,
    userId,
    queryRunner,
    relationsAndSelects = orderFindOneDefault,
  }: {
    id: number;
    userId?: number;
    queryRunner?: QueryRunner;
    relationsAndSelects?: RelationsAndSelectsOptions;
  }): Promise<NullableType<Order>> {
    const repository = this.getRepository(queryRunner);
    let queryBuilder = repository.createQueryBuilder('order');

    queryBuilder = addRelationsAndSelects(queryBuilder, relationsAndSelects);

    queryBuilder.andWhere('order.id = :id', { id });

    // If userId provided, restrict to user's own orders
    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    const entity = await queryBuilder.getOne();
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async updateStatus(
    id: number,
    status: OrderStatusEnum,
    expectedStatus: OrderStatusEnum,
    queryRunner?: QueryRunner,
  ): Promise<Order | null> {
    const repository = this.getRepository(queryRunner);
    const result = await repository
      .createQueryBuilder()
      .update(OrderEntity)
      .set({ status })
      .where('id = :id', { id })
      .andWhere('status = :expectedStatus', { expectedStatus })
      .execute();

    if (result.affected !== 1) {
      return null;
    }

    return this.findOne({ id, queryRunner });
  }
}
