import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
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
  @IsString()
  @MaxLength(32)
  phoneNumber: string;

  @ApiProperty({ minLength: 8, maxLength: 72 })
  @MinLength(8)
  @MaxLength(72)
  @IsString()
  password: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  lastName: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profilePicture?: string | null;

  // Role is always forced to `user` on public registration.
  // Not exposed in Swagger — cannot be set by the client.
  role: RoleEnum = RoleEnum.user;
}
