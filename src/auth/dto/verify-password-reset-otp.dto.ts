import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class VerifyPasswordResetOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit reset code' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  otpCode: string;
}
