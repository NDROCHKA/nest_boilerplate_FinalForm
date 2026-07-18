import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        errors: {
          product: 'Product not found',
        },
        data,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ProductOutOfStockException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          product: 'Product is out of stock or insufficient quantity',
        },
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ProductNotActiveException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          product: 'Product is not currently available',
        },
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidProductSizeException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          product: 'Selected size is not available for this product',
        },
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidProductColorException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          product: 'Selected color is not available for this product',
        },
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
