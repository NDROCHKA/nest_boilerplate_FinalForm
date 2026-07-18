import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../utils/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatusEnum,
    example: OrderStatusEnum.confirmed,
    description: 'New order status',
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
