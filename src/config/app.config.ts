import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import validateConfig from './validate-config';
import { isAbsolute, resolve } from 'path';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  UPLOADS_DIR: string;

  @IsInt()
  @Min(0)
  @Max(5)
  @IsOptional()
  TRUST_PROXY_HOPS: number;
}

const resolveUploadsDirectory = (): string => {
  const configuredPath = process.env.UPLOADS_DIR || 'uploads';
  return isAbsolute(configuredPath)
    ? configuredPath
    : resolve(process.cwd(), configuredPath);
};

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_DOMAIN) {
    throw new Error('FRONTEND_DOMAIN is required in production');
  }

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.FRONTEND_DOMAIN &&
    !process.env.FRONTEND_DOMAIN.startsWith('https://')
  ) {
    throw new Error('FRONTEND_DOMAIN must use HTTPS in production');
  }

  if (process.env.NODE_ENV == 'test') {
    return {
      nodeEnv: process.env.NODE_ENV,
      name: process.env.APP_NAME || 'app',
      workingDirectory: process.env.PWD || process.cwd(),
      frontendDomain: process.env.FRONTEND_DOMAIN,
      uploadsDirectory: resolveUploadsDirectory(),
      trustProxyHops: process.env.TRUST_PROXY_HOPS
        ? parseInt(process.env.TRUST_PROXY_HOPS, 10)
        : 0,
      port: process.env.TEST_APP_PORT
        ? parseInt(process.env.TEST_APP_PORT, 10)
        : process.env.TEST_PORT
          ? parseInt(process.env.TEST_PORT, 10)
          : 3000,
      apiPrefix: process.env.API_PREFIX || 'api',
      fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
      headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    };
  } else {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      name: process.env.APP_NAME || 'app',
      workingDirectory: process.env.PWD || process.cwd(),
      frontendDomain: process.env.FRONTEND_DOMAIN,
      uploadsDirectory: resolveUploadsDirectory(),
      trustProxyHops: process.env.TRUST_PROXY_HOPS
        ? parseInt(process.env.TRUST_PROXY_HOPS, 10)
        : 0,
      port: process.env.APP_PORT
        ? parseInt(process.env.APP_PORT, 10)
        : process.env.PORT
          ? parseInt(process.env.PORT, 10)
          : 3000,
      apiPrefix: process.env.API_PREFIX || 'api',
      fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
      headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    };
  }
});
