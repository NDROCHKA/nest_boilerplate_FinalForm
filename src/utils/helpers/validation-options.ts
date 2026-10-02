import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ValidationErrors {
  [property: string]: string | ValidationErrors;
}

function generateErrors(errors: ValidationError[]): ValidationErrors {
  const result: ValidationErrors = {};
  for (const error of errors) {
    result[error.property] =
      (error.children?.length ?? 0) > 0
        ? generateErrors(error.children ?? [])
        : Object.values(error.constraints ?? {}).join(', ');
  }
  return result;
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

export default validationOptions;
