import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        errors: {
          category: 'Category not found',
        },
        data,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CategoryNameAlreadyExistsException extends HttpException {
  constructor(data?: Record<string, unknown>) {
    super(
      {
        status: HttpStatus.CONFLICT,
        errors: {
          category: 'Category with this name already exists',
        },
        data,
      },
      HttpStatus.CONFLICT,
    );
  }
}
