import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigHelper } from './errorConfig';

interface PublicErrorResponse {
  statusCode: HttpStatus;
  errorCode: string;
  message: string;
  details?: Record<string, unknown>;
}

const createResponse = (
  errorCode: string,
  message: string,
  status: HttpStatus,
  details?: Record<string, unknown>,
): PublicErrorResponse => {
  const response: PublicErrorResponse = {
    statusCode: status,
    errorCode,
    message,
  };
  if (ConfigHelper.getInstance().getShowErrorDetails() && details) {
    response.details = details;
  }
  return response;
};

export class BaseCustomException extends HttpException {
  constructor(
    public readonly errorCode: string,
    message: string,
    status: HttpStatus,
    details?: Record<string, unknown>,
  ) {
    super(createResponse(errorCode, message, status, details), status);
  }
}

export class DatabaseException extends HttpException {
  constructor(
    public readonly errorCode: string,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: Record<string, unknown>,
  ) {
    super(createResponse(errorCode, message, status, details), status);
  }
}

export class GenericServiceException extends HttpException {
  constructor(
    public readonly errorCode: string,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: Record<string, unknown>,
  ) {
    super(createResponse(errorCode, message, status, details), status);
  }
}
