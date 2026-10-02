import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'M', description: 'Selected size' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  size: string;

  @ApiProperty({ example: 'Black', description: 'Selected color' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  color: string;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '6200a4f1-5528-4b2f-911b-fcc4aa532c09',
    description: 'Stable client-generated key that makes retries idempotent',
  })
  @IsUUID('4')
  clientOrderId: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Items to order',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    example: '123 Main Street, Apt 4B, New York, NY 10001',
    description: 'Shipping address for cash on delivery',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  shippingAddress: string;

  @ApiProperty({
    example: '+11234567890',
    description: 'Contact phone number for delivery',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phoneNumber: string;
}
