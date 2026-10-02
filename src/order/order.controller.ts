import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { Order } from './domain/order';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../utils/decorators/getUser.decorator';
import { OrderNotFoundException } from './exceptions/order.exceptions';
import { TransactionQueryRunner } from '../utils/decorators/transaction-query-runner.decorator';
import { QueryRunnerInterceptor } from '../utils/interceptors/query-runner.interceptor';
import type { QueryRunner } from 'typeorm';

/**
 * USER Order Controller — Requires authentication (JWT).
 * Logged-in users can place orders and view their own orders.
 */
@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() userId: number,
    @Body() createOrderDto: CreateOrderDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Order> {
    return this.orderService.create({
      userId,
      createOrderDto,
      queryRunner,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findMyOrders(
    @GetUser() userId: number,
    @Query() query: QueryOrderDto,
  ): Promise<{ data: Order[]; totalCount: number }> {
    return this.orderService.findUserOrders({
      userId,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @GetUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    const order = await this.orderService.findUserOrder({ id, userId });

    if (!order) {
      throw new OrderNotFoundException({ id });
    }

    return order;
  }
}
