import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './order.controller';
import { OrderAdminController } from './order.admin.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './infrastructure/order.entity';
import { OrderItemEntity } from './infrastructure/order-item.entity';
import { OrderRepository } from './infrastructure/order.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    ProductModule, // Needed for product validation during order creation
  ],
  controllers: [OrderController, OrderAdminController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
