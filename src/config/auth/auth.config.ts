import { registerAs } from '@nestjs/config';
import { IsString, Matches, MinLength } from 'class-validator';
import { AuthConfig } from './auth-config.type';
import type { AuthDuration } from './auth-config.type';
import validateConfig from '../validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @MinLength(32)
  AUTH_JWT_SECRET: string;

  @IsString()
  @Matches(/^\d+[smhd]$/)
  AUTH_JWT_TOKEN_EXPIRES_IN: AuthDuration;

  @IsString()
  @MinLength(32)
  AUTH_REFRESH_SECRET: string;

  @IsString()
  @Matches(/^\d+[smhd]$/)
  AUTH_REFRESH_TOKEN_EXPIRES_IN: AuthDuration;
}

export default registerAs<AuthConfig>('auth', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  if (process.env.AUTH_JWT_SECRET === process.env.AUTH_REFRESH_SECRET) {
    throw new Error(
      'AUTH_JWT_SECRET and AUTH_REFRESH_SECRET must be different',
    );
  }

  return {
    secret: validated.AUTH_JWT_SECRET,
    expires: validated.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: validated.AUTH_REFRESH_SECRET,
    refreshExpires: validated.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    issuer: process.env.AUTH_JWT_ISSUER || 'crusaders-api',
    audience: process.env.AUTH_JWT_AUDIENCE || 'crusaders-web',
  };
});
