import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
