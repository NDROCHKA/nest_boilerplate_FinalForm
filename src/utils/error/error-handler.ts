import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  DatabaseException,
  GenericServiceException,
} from './global-exceptions';
import { Logger } from '@nestjs/common';

const logger = new Logger('ErrorHandler');

interface DatabaseDriverError {
  code?: string;
}

export function handleError(
  error: unknown,
  errorCode: string,
  message: string,
): never {
  if (error instanceof HttpException) {
    throw error;
  } else if (error instanceof QueryFailedError) {
    const candidate: unknown = error.driverError;
    const driverError: DatabaseDriverError =
      typeof candidate === 'object' && candidate !== null && 'code' in candidate
        ? {
            code:
              typeof candidate.code === 'string' ? candidate.code : undefined,
          }
        : {};
    logger.error('Database query failed', error.stack);

    const details = {
      query: error.query,
      parameters: error.parameters,
      name: error.name,
      driverCode: driverError.code,
    };

    if (driverError.code === '23505') {
      throw new DatabaseException(
        'DATABASE_UNIQUE_CONSTRAINT',
        'A record with the same unique value already exists.',
        HttpStatus.CONFLICT,
        details,
      );
    }

    if (driverError.code === '23503' || driverError.code === '23514') {
      throw new DatabaseException(
        'DATABASE_CONSTRAINT',
        'The requested operation conflicts with related data.',
        HttpStatus.CONFLICT,
        details,
      );
    }

    throw new DatabaseException(
      errorCode,
      'A database operation failed. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  } else {
    logger.error(`Unexpected error (${errorCode}):`, error);
    throw new GenericServiceException(
      errorCode,
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        originalError: error instanceof Error ? error.message : String(error),
      },
    );
  }
}
