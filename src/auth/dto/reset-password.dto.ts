import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Single-use token returned after OTP verification',
  })
  @IsString()
  @Length(64, 64)
  resetToken: string;

  @ApiProperty({ minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword: string;
}
