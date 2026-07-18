import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderNotFoundException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        errors: {
          order: 'Order not found',
        },
        data,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class OrderEmptyCartException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          order: 'Order must contain at least one item',
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class OrderInvalidStatusTransitionException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          order: 'Invalid status transition',
        },
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
