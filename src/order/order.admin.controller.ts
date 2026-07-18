import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { Order } from './domain/order';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/roles.enum';
import { OrderNotFoundException } from './exceptions/order.exceptions';
import { TransactionQueryRunner } from '../utils/decorators/transaction-query-runner.decorator';
import { QueryRunnerInterceptor } from '../utils/interceptors/query-runner.interceptor';
import type { QueryRunner } from 'typeorm';

/**
 * ADMIN Order Controller — Super Admin only.
 * View all orders and manage order statuses.
 */
@UseInterceptors(QueryRunnerInterceptor)
@ApiTags('Order Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.superAdmin)
@Controller({ path: 'order-admin', version: '1' })
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryOrderDto,
  ): Promise<{ data: Order[]; totalCount: number }> {
    return this.orderService.findAllOrders({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const order = await this.orderService.findOneAdmin({ id });

    if (!order) {
      throw new OrderNotFoundException({ id });
    }

    return order;
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<Order> {
    return this.orderService.updateStatus({
      id,
      status: updateOrderStatusDto.status,
      queryRunner,
    });
  }
}
