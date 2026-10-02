import { registerAs } from '@nestjs/config';
import { IsInt, IsString } from 'class-validator';
import { MailConfig } from './mail-config.type';
import validateConfig from '../validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  MAIL_HOST: string;

  @IsInt()
  MAIL_PORT: number;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @IsString()
  MAIL_DEFAULT_EMAIL: string;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.MAIL_HOST ||
      !process.env.MAIL_USER ||
      !process.env.MAIL_PASSWORD ||
      !process.env.MAIL_DEFAULT_EMAIL)
  ) {
    throw new Error(
      'MAIL_HOST, MAIL_USER, MAIL_PASSWORD, and MAIL_DEFAULT_EMAIL are required in production',
    );
  }

  return {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    defaultName: process.env.MAIL_DEFAULT_NAME || 'App',
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL || '',
  };
});
