import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleEnum } from '../../utils/enums/roles.enum';

/**
 * Public registration DTO — role is ALWAYS forced to `user`.
 * The role field is excluded from the API body; it's set automatically.
 */
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+11234567890' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ minLength: 3 })
  @MinLength(3)
  @IsString()
  password: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string | null;

  // Role is always forced to `user` on public registration.
  // Not exposed in Swagger — cannot be set by the client.
  role: RoleEnum = RoleEnum.user;
}
