import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'M', description: 'Selected size' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 'Black', description: 'Selected color' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Items to order',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    example: '123 Main Street, Apt 4B, New York, NY 10001',
    description: 'Shipping address for cash on delivery',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    example: '+11234567890',
    description: 'Contact phone number for delivery',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
