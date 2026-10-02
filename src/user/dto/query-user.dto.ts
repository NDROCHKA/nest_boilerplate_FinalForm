import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

import { User } from '../domain/user';

export class FilterUserDto {
  @ApiPropertyOptional({
    description: 'Search term matching first or last name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by email address' })
  @IsOptional()
  @IsString()
  email?: string;
}

export class SortUserDto {
  @ApiPropertyOptional({ example: 'createdAt' })
  @IsString()
  @IsIn([
    'id',
    'email',
    'firstName',
    'lastName',
    'role',
    'createdAt',
    'updatedAt',
  ])
  orderBy?: keyof User;

  @ApiPropertyOptional({ example: 'ASC', enum: ['ASC', 'DESC'] })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}

const parseJsonQuery = (value: unknown, field: string): unknown => {
  if (typeof value !== 'string') {
    throw new BadRequestException(`${field} must be JSON encoded`);
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new BadRequestException(`${field} contains invalid JSON`);
  }
};

export class QueryUserDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @ApiPropertyOptional({
    type: String,
    description: 'JSON stringified filters',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(FilterUserDto, parseJsonQuery(value, 'filters'))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto | null;

  @ApiPropertyOptional({ type: String, description: 'JSON stringified sort' })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(SortUserDto, parseJsonQuery(value, 'sort'))
      : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  @IsArray()
  sort?: SortUserDto[] | null;
}
