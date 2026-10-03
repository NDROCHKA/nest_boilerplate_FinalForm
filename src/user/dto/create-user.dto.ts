import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

/**
 * Public registration DTO — role is ALWAYS forced to `user`.
 * The role field is excluded from the API body; it's set automatically.
 */
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({ example: '+11234567890' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsString({ message: 'Phone number must be text.' })
  @Matches(/^\+?[0-9]{8,15}$/, {
    message: 'Enter a valid phone number with 8 to 15 digits.',
  })
  @MaxLength(32)
  phoneNumber: string;

  @ApiProperty({ minLength: 8, maxLength: 72 })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(72, { message: 'Password must be at most 72 characters.' })
  @IsString({ message: 'Password is required.' })
  password: string;

  @ApiProperty({ example: 'Jane' })
  @IsString({ message: 'First name is required.' })
  @IsNotEmpty({ message: 'First name is required.' })
  @MinLength(2, { message: 'First name must be at least 2 characters.' })
  @MaxLength(120, { message: 'First name must be at most 120 characters.' })
  @Matches(/^[\p{L}\p{M}][\p{L}\p{M}' -]*$/u, {
    message:
      'First name can only contain letters, spaces, apostrophes, or hyphens.',
  })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Last name is required.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  @MinLength(2, { message: 'Last name must be at least 2 characters.' })
  @MaxLength(120, { message: 'Last name must be at most 120 characters.' })
  @Matches(/^[\p{L}\p{M}][\p{L}\p{M}' -]*$/u, {
    message:
      'Last name can only contain letters, spaces, apostrophes, or hyphens.',
  })
  lastName: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profilePicture?: string | null;
}
