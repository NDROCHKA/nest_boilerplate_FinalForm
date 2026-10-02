import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayMaxSize,
  MaxLength,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Classic White T-Shirt' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Premium cotton t-shirt with a relaxed fit',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @ApiProperty({ example: 29.99 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Discount percentage (0-100)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Available sizes — defined by the Super Admin',
  })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  sizes: string[];

  @ApiProperty({
    example: ['White', 'Black', 'Navy'],
    description: 'Available colors',
  })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  colors: string[];

  @ApiProperty({ example: 150, description: 'Stock quantity' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId: number;

  @ApiPropertyOptional({
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    description: 'Array of image URLs',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Whether product is visible in the store',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
